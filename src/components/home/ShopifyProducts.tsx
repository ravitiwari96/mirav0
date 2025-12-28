import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ShopifyProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts(8);
        setProducts(productData);
        setError(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: ShopifyProduct) => {
    const defaultVariant = product.node.variants.edges[0]?.node;
    
    if (!defaultVariant) {
      toast.error("Product variant not available");
      return;
    }

    const cartItem = {
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.node.title} has been added to your cart`,
      position: "top-center"
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our sustainable essentials
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground mb-8">
              Products coming soon – Stay tuned!
            </p>
            <p className="text-sm text-muted-foreground">
              Our sustainable collection is being prepared. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sustainable essentials for everyday living
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.slice(0, 8).map((product) => {
            const image = product.node.images.edges[0]?.node;
            const price = product.node.priceRange.minVariantPrice;
            
            return (
              <Card key={product.node.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <Link to={`/product/${product.node.handle}`}>
                  <div className="aspect-square overflow-hidden bg-secondary/10">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col h-[220px]">
                  <Link to={`/product/${product.node.handle}`}>
                    <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                      {product.node.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 min-h-[40px]">
                    {product.node.description || "Sustainable eco-friendly product"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-auto"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/shop">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ShopifyProducts;
