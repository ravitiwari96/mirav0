import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import miravoLogo from "@/assets/miravo-logo-new.png";
import { useCartStore } from "@/stores/cartStore";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "@/components/SidebarNav";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search and sidebar on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsSidebarOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Search products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await fetchProducts(10, searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearchSelect = (handle: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${handle}`);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const openCart = () => {
    // Trigger cart drawer - we'll dispatch a custom event
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left - Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-foreground hover:bg-transparent"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </Button>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-2xl md:text-3xl font-heading font-bold tracking-wide text-foreground">
                MIRAVO
              </span>
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/account")}
                className="h-10 w-10 text-foreground hover:bg-transparent"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="h-10 w-10 text-foreground hover:bg-transparent"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={openCart}
                className="h-10 w-10 text-foreground hover:bg-transparent relative"
              >
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-foreground text-background">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Inline Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto px-4">
              <div className="flex items-center h-14 gap-4">
                <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Input
                  ref={searchInputRef}
                  placeholder="SEARCH FOR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground/70 placeholder:uppercase placeholder:tracking-wider focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseSearch}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Search Results */}
              {(isSearching || searchResults.length > 0 || (searchQuery.length >= 2 && searchResults.length === 0)) && (
                <div className="border-t border-border py-4">
                  {isSearching && (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  )}
                  
                  {!isSearching && searchResults.length > 0 && (
                    <div className="max-h-80 overflow-y-auto space-y-1">
                      {searchResults.map((product) => (
                        <button
                          key={product.node.id}
                          onClick={() => handleSearchSelect(product.node.handle)}
                          className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-14 h-14 rounded-md overflow-hidden bg-secondary/10 flex-shrink-0">
                            {product.node.images.edges[0]?.node.url && (
                              <img
                                src={product.node.images.edges[0].node.url}
                                alt={product.node.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{product.node.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.node.priceRange.minVariantPrice.currencyCode} {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                    <p className="text-center text-muted-foreground py-6">
                      No products found for "{searchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Navigation */}
      <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
