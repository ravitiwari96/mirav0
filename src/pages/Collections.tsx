import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RewardsFloatingButton from "@/components/RewardsFloatingButton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Leaf, ArrowRight } from "lucide-react";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Collections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(20);
        setCollections(data);
      } catch (error) {
        console.error("Error loading collections:", error);
        toast.error("Failed to load collections");
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RewardsFloatingButton />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-accent/30">
              <Leaf className="h-4 w-4 mr-2 inline" />
              Curated Collections
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground tracking-tight">
              Discover Collections
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Explore thoughtfully curated collections of sustainable essentials for every aspect of your life.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full" />
                  <div className="p-8 space-y-3">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && collections.length === 0 && (
            <div className="text-center py-20">
              <Leaf className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                Collections coming soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're curating beautiful collections for you. Check back soon!
              </p>
              <Button onClick={() => navigate("/shop")} variant="default" size="lg">
                Browse All Products
              </Button>
            </div>
          )}

          {/* Collections Grid */}
          {!isLoading && collections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {collections.map((collection, index) => (
                <Card
                  key={collection.node.id}
                  className="group overflow-hidden border border-border/40 hover:border-accent/40 hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/shop`)}
                >
                  {/* Collection Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-accent/5 to-primary/5">
                    {collection.node.image ? (
                      <img
                        src={collection.node.image.url}
                        alt={collection.node.image.altText || collection.node.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                        <Leaf className="h-24 w-24 text-muted-foreground/20" />
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-background rounded-full p-3">
                        <ArrowRight className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Collection Info */}
                  <div className="p-8 space-y-4">
                    <h2 className="text-3xl font-heading font-bold text-foreground group-hover:text-accent transition-colors">
                      {collection.node.title}
                    </h2>
                    {collection.node.description && (
                      <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                        {collection.node.description}
                      </p>
                    )}
                    <div className="pt-2">
                      <Button
                        variant="ghost"
                        className="group-hover:text-accent transition-colors p-0 h-auto font-semibold"
                      >
                        Explore Collection
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;
