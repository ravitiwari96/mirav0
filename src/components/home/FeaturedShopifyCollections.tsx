import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Leaf } from "lucide-react";
import { fetchCollections, ShopifyCollection } from "@/lib/shopify";

const FeaturedShopifyCollections = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await fetchCollections(3);
        setCollections(data);
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Shop by Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughtfully curated collections for sustainable living
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {collections.map((collection, index) => (
            <Card
              key={collection.node.id}
              className="group overflow-hidden border border-border/40 hover:border-accent/40 hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate("/collections")}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/5">
                {collection.node.image ? (
                  <img
                    src={collection.node.image.url}
                    alt={collection.node.image.altText || collection.node.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                    <Leaf className="h-16 w-16 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-heading font-bold text-foreground group-hover:text-accent transition-colors">
                  {collection.node.title}
                </h3>
                {collection.node.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {collection.node.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/collections")}
            variant="outline"
            size="lg"
            className="group border-2"
          >
            View All Collections
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShopifyCollections;
