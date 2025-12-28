import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Menu items with images
const menuItems = [
  { 
    name: "HOME", 
    path: "/",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=200&fit=crop"
  },
  { 
    name: "ALL PRODUCTS", 
    path: "/shop",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop"
  },
  { 
    name: "MOST LOVED", 
    path: "/shop?collection=most-loved",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop"
  },
  { 
    name: "FESTIVE GIFTS", 
    path: "/shop?collection=festive-gifts",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=200&h=200&fit=crop"
  },
  { 
    name: "GIFTS UNDER INR 400", 
    path: "/shop?collection=gifts-under-400",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop"
  },
  { 
    name: "TOOTHBRUSHES", 
    path: "/shop?collection=toothbrushes",
    image: "https://images.unsplash.com/photo-1559893088-c0787ebfc084?w=200&h=200&fit=crop"
  },
  { 
    name: "MIRAVO REWARDS", 
    path: "/rewards",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop"
  },
  { 
    name: "ABOUT", 
    path: "/about",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop"
  },
];

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarNav = ({ isOpen, onClose }: SidebarNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" />
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md z-50 bg-background transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <span className="text-xl font-heading font-bold tracking-wide">MENU</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 text-foreground hover:bg-transparent"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-border">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-secondary/30 border-0 text-base placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems
              .filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center px-6 py-4 hover:bg-secondary/30 transition-colors"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={onClose}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Menu Text */}
                  <span className={`text-lg font-bold tracking-wider transition-colors ${
                    hoveredItem === item.name || location.pathname === item.path
                      ? "text-accent"
                      : "text-foreground"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Pure. Durable. Sustainable.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
