import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RewardsFloatingButton from "@/components/RewardsFloatingButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { fetchProducts, ShopifyProduct, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Shop = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams] = useSearchParams();
  const collection = searchParams.get("collection");
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(50);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let sorted = [...products];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => 
          parseFloat(a.node.priceRange.minVariantPrice.amount) - 
          parseFloat(b.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high":
        sorted.sort((a, b) => 
          parseFloat(b.node.priceRange.minVariantPrice.amount) - 
          parseFloat(a.node.priceRange.minVariantPrice.amount)
        );
        break;
      case "newest":
        // Keep original order (newest first from API)
        break;
      default:
        // Featured - keep original
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortBy, products]);

  const handleQuickAdd = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.node.variants.edges[0]?.node;
    if (!defaultVariant) {
      toast.error("Product variant not available");
      return;
    }

    const cartItem: CartItem = {
      product,
      variantId: defaultVariant.id,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      selectedOptions: defaultVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to bag!", {
      description: product.node.title,
    });
  };

  const getDiscountPercentage = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return null;
    
    // Mock compare at price for demo (in real app, this would come from Shopify)
    const currentPrice = parseFloat(variant.price.amount);
    const compareAtPrice = currentPrice * 1.25; // 25% higher as compare price
    
    if (compareAtPrice > currentPrice) {
      const discount = Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100);
      return { discount, compareAtPrice };
    }
    return null;
  };

  const getCategoryTitle = () => {
    if (collection === "most-loved") return "MOST LOVED";
    if (collection === "festive-gifts") return "FESTIVE GIFTS";
    if (collection === "gifts-under-400") return "GIFTS UNDER ₹400";
    if (collection === "toothbrushes") return "TOOTHBRUSHES";
    return "ALL PRODUCTS";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RewardsFloatingButton />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-secondary to-muted overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1604176354204-9268737828e4?w=1920')" 
            }}
          />
          <div className="absolute inset-0 bg-foreground/40" />
          
          {/* Breadcrumbs */}
          <div className="absolute top-6 left-0 right-0">
            <div className="container mx-auto px-4">
              <nav className="flex items-center space-x-2 text-sm text-background/80">
                <Link to="/" className="hover:text-background transition-colors">Home</Link>
                <span>/</span>
                <span className="text-background font-medium">{getCategoryTitle()}</span>
              </nav>
            </div>
          </div>
          
          {/* Category Title */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-background tracking-wider">
              {getCategoryTitle()}
            </h1>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 md:top-20 z-30 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              {/* Left - Filter Button & Product Count */}
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-foreground">
                      <SlidersHorizontal className="h-4 w-4" />
                      <span className="hidden sm:inline">FILTER</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Price Range</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Under ₹200</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">₹200 - ₹400</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">₹400 - ₹600</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Above ₹600</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Availability</h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" defaultChecked />
                            <span className="text-sm">In Stock</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">Out of Stock</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} PRODUCTS
                </span>
              </div>
              
              {/* Right - Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-0 bg-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground">
                Check back soon for new arrivals.
              </p>
            </div>
          )}

          {/* Products */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                const discountInfo = getDiscountPercentage(product);
                const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
                const currency = product.node.priceRange.minVariantPrice.currencyCode;
                
                return (
                  <div
                    key={product.node.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${product.node.handle}`)}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20 mb-3">
                      {product.node.images.edges[0]?.node ? (
                        <img
                          src={product.node.images.edges[0].node.url}
                          alt={product.node.images.edges[0].node.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                          <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {discountInfo && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-accent text-accent-foreground text-xs font-semibold">
                            SAVE {discountInfo.discount}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground text-sm md:text-base line-clamp-2 leading-tight">
                        {product.node.title}
                      </h3>
                      
                      {/* Ratings */}
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < 4 ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(24)</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {currency} {price.toFixed(0)}
                        </span>
                        {discountInfo && (
                          <span className="text-sm text-muted-foreground line-through">
                            {currency} {discountInfo.compareAtPrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <Button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className="w-full h-10 bg-foreground text-background hover:bg-accent font-medium text-sm tracking-wider"
                      >
                        ADD TO CART
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
