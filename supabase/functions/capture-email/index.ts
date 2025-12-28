import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailCaptureRequest {
  email: string;
  name?: string;
}

// Generate a unique discount code
function generateDiscountCode(): string {
  const prefix = "MIRAVO15";
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name }: EmailCaptureRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
      .from("email_captures")
      .select("discount_code")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      console.log("Email already exists, returning existing discount code");
      return new Response(
        JSON.stringify({ 
          success: true, 
          discountCode: existingEmail.discount_code,
          message: "Welcome back! Your discount code is still valid."
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate new discount code
    const discountCode = generateDiscountCode();

    // Save to database
    const { error: insertError } = await supabase
      .from("email_captures")
      .insert({ email, discount_code: discountCode });

    if (insertError) {
      console.error("Error inserting email capture:", insertError);
      throw new Error("Failed to save email");
    }

    console.log(`Email captured: ${email}, discount code: ${discountCode}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        discountCode,
        message: "You've unlocked 15% off! Use this code at checkout."
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in capture-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
