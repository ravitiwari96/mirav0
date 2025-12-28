import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RewardsFloatingButton from "@/components/RewardsFloatingButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShoppingCart } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ShopifyShop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts(50);
        setProducts(productData);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <RewardsFloatingButton />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Shop Sustainable
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of eco-friendly products that make a difference
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-heading font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">
                Our sustainable product collection is being prepared. Check back soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Want to add products? Just tell me what products you'd like to create with their prices!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              
              return (
                <Card key={product.node.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/product/${product.node.handle}`}>
                    <div className="aspect-square overflow-hidden bg-secondary/10">
                      {image ? (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link to={`/product/${product.node.handle}`}>
                      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                    </Link>
                    
                    {product.node.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.node.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </span>
                      
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopifyShop;
