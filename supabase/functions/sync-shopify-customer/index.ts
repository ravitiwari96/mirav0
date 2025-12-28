import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncRequest {
  action: 'create' | 'update' | 'get_orders';
  email?: string;
  name?: string;
  supabase_user_id?: string;
  shopify_customer_id?: string;
  phone?: string;
  address?: {
    address1?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
  };
}

const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
const SHOPIFY_STORE_DOMAIN = "5rbbdv-tc.myshopify.com";
const SHOPIFY_API_VERSION = "2025-01";

async function shopifyAdminRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Shopify API error:", errorText);
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    console.error("Shopify GraphQL errors:", data.errors);
    throw new Error(`Shopify GraphQL error: ${data.errors[0]?.message}`);
  }

  return data;
}

async function findCustomerByEmail(email: string) {
  const query = `
    query findCustomer($query: String!) {
      customers(first: 1, query: $query) {
        edges {
          node {
            id
            email
            firstName
            lastName
            createdAt
            phone
            defaultAddress {
              address1
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(query, { query: `email:${email}` });
  return data.data?.customers?.edges?.[0]?.node || null;
}

async function createShopifyCustomer(email: string, name: string) {
  const nameParts = name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(mutation, {
    input: {
      email,
      firstName,
      lastName,
    },
  });

  if (data.data?.customerCreate?.userErrors?.length > 0) {
    const error = data.data.customerCreate.userErrors[0];
    throw new Error(`Shopify customer creation error: ${error.message}`);
  }

  return data.data?.customerCreate?.customer;
}

async function updateShopifyCustomer(
  shopifyCustomerId: string,
  updates: { name?: string; phone?: string; address?: SyncRequest['address'] }
) {
  const nameParts = updates.name?.split(' ') || [];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const input: Record<string, unknown> = { id: shopifyCustomerId };
  
  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;
  if (updates.phone) input.phone = updates.phone;

  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(mutation, { input });

  if (data.data?.customerUpdate?.userErrors?.length > 0) {
    const error = data.data.customerUpdate.userErrors[0];
    throw new Error(`Shopify customer update error: ${error.message}`);
  }

  return data.data?.customerUpdate?.customer;
}

async function getCustomerOrders(shopifyCustomerId: string) {
  const query = `
    query getCustomerOrders($customerId: ID!) {
      customer(id: $customerId) {
        orders(first: 20, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFinancialStatus
              displayFulfillmentStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyAdminRequest(query, { customerId: shopifyCustomerId });
  return data.data?.customer?.orders?.edges?.map((edge: { node: unknown }) => edge.node) || [];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    if (!SHOPIFY_ACCESS_TOKEN) {
      console.warn("Shopify access token not configured - skipping Shopify sync");
      return new Response(
        JSON.stringify({ success: true, message: "Shopify sync skipped - not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const request: SyncRequest = await req.json();

    console.log("Sync request:", JSON.stringify(request, null, 2));

    switch (request.action) {
      case 'create': {
        if (!request.email || !request.name || !request.supabase_user_id) {
          return new Response(
            JSON.stringify({ error: "Missing required fields: email, name, supabase_user_id" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Check if customer already exists
        let customer = await findCustomerByEmail(request.email);
        
        if (!customer) {
          // Create new customer
          customer = await createShopifyCustomer(request.email, request.name);
        }

        // Extract numeric ID from Shopify GID
        const shopifyCustomerId = customer.id;

        // Update profile with Shopify customer ID
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ shopify_customer_id: shopifyCustomerId })
          .eq('user_id', request.supabase_user_id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
        }

        return new Response(
          JSON.stringify({
            success: true,
            shopify_customer_id: shopifyCustomerId,
            created_at: customer.createdAt,
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case 'update': {
        if (!request.shopify_customer_id) {
          return new Response(
            JSON.stringify({ error: "Missing shopify_customer_id" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const updatedCustomer = await updateShopifyCustomer(
          request.shopify_customer_id,
          {
            name: request.name,
            phone: request.phone,
            address: request.address,
          }
        );

        return new Response(
          JSON.stringify({ success: true, customer: updatedCustomer }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case 'get_orders': {
        if (!request.shopify_customer_id && !request.email) {
          return new Response(
            JSON.stringify({ error: "Missing shopify_customer_id or email" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        let customerId = request.shopify_customer_id;
        
        if (!customerId && request.email) {
          const customer = await findCustomerByEmail(request.email);
          if (customer) {
            customerId = customer.id;
          }
        }

        if (!customerId) {
          return new Response(
            JSON.stringify({ success: true, orders: [] }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const orders = await getCustomerOrders(customerId);

        return new Response(
          JSON.stringify({ success: true, orders }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }
  } catch (error: unknown) {
    console.error("Error in sync-shopify-customer function:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
