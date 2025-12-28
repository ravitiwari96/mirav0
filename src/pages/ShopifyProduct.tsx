import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ShoppingCart, ChevronLeft } from "lucide-react";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ShopifyProduct = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        const productData = await fetchProductByHandle(handle);
        if (productData) {
          setProduct(productData);
          setSelectedVariant(productData.variants.edges[0]?.node);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${quantity} × ${product.title} added to your cart`,
      position: "top-center"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Product not found</h1>
          <Link to="/shop">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.edges;
  const currentImage = images[selectedImage]?.node;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{product.title} | MIRAVO - Sustainable Essentials</title>
        <meta name="description" content={product.description || `${product.title} - Eco-friendly product from MIRAVO`} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        {currentImage && <meta property="og:image" content={currentImage.url} />}
      </Helmet>
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <Link to="/shop" className="inline-flex items-center text-primary hover:underline mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary/10">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-4">{product.title}</h1>
              <div className="text-3xl font-bold text-primary mb-6">
                {selectedVariant.price.currencyCode} {parseFloat(selectedVariant.price.amount).toFixed(2)}
              </div>
            </div>

            {product.description && (
              <div>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Variant Options */}
            {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="space-y-4">
                {product.options.map((option: any) => (
                  <div key={option.name}>
                    <label className="block text-sm font-medium mb-2">{option.name}</label>
                    <div className="flex gap-2 flex-wrap">
                      {option.values.map((value: string) => {
                        const variant = product.variants.edges.find((v: any) =>
                          v.node.selectedOptions.some((opt: any) => opt.name === option.name && opt.value === value)
                        );
                        const isSelected = selectedVariant?.selectedOptions.some(
                          (opt: any) => opt.name === option.name && opt.value === value
                        );
                        
                        return (
                          <Button
                            key={value}
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => variant && setSelectedVariant(variant.node)}
                            disabled={!variant?.node.availableForSale}
                          >
                            {value}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
            </Button>

            {/* Additional Info */}
            <Card className="p-6 bg-secondary/5">
              <h3 className="font-semibold mb-3">Sustainable Choice</h3>
              <p className="text-sm text-muted-foreground">
                By choosing this product, you're supporting sustainable practices and reducing environmental impact.
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopifyProduct;
