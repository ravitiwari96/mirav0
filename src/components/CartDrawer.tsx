import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { createStorefrontCheckout } from "@/lib/shopify";
import { toast } from "sonner";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    items, 
    updateQuantity, 
    removeItem, 
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  // Listen for open-cart event
  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    
    setIsLoading(true);
    try {
      const checkoutUrl = await createStorefrontCheckout(items);
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        toast.success("Redirecting to checkout...");
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Failed to create checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="flex-shrink-0 pb-4 border-b border-border">
          <SheetTitle className="text-xl font-heading">Your Bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Your bag is empty</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add items to get started</p>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 bg-secondary/20 rounded-lg">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-secondary/30 flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
                          {item.product.node.title}
                        </h4>
                        {item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.variantTitle}
                          </p>
                        )}
                        <p className="font-semibold text-foreground mt-2">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-border bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-base text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-heading font-bold text-foreground">
                    {items[0]?.price.currencyCode || 'INR'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 bg-foreground text-background hover:bg-accent font-semibold tracking-wider" 
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      CREATING CHECKOUT...
                    </>
                  ) : (
                    <>
                      CHECKOUT
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
