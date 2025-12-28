import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import bambooToothbrush from "@/assets/bamboo-toothbrush.png";
import bambooMug from "@/assets/bamboo-mug.png";
import bambooBottle from "@/assets/bamboo-bottle.png";
import juteLoofah from "@/assets/jute-loofah.png";

const collections = [
  {
    id: 1,
    name: "Bamboo Toothbrushes",
    description: "Start your sustainable journey",
    image: bambooToothbrush,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Coffee & Tea",
    description: "Elegant & eco-friendly drinkware",
    image: bambooMug,
    badge: "Popular",
  },
  {
    id: 3,
    name: "Bottles & Flasks",
    description: "Stay hydrated sustainably",
    image: bambooBottle,
    badge: "New",
  },
  {
    id: 4,
    name: "Bath & Body",
    description: "Natural care essentials",
    image: juteLoofah,
    badge: "Premium",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
          <Leaf className="h-4 w-4" />
          Featured Collections
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
          Discover Our Range
        </h2>
        <p className="text-lg text-muted-foreground">
          From morning routines to evening rituals, we've got your sustainable
          lifestyle covered.
        </p>
      </div>

      {/* Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <Link
            key={collection.id}
            to="/shop"
            className="group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className="product-card overflow-hidden border-border/50 h-full">
              <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-secondary/30 to-secondary/10">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="badge-eco">
                    {collection.badge}
                  </span>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full font-medium uppercase tracking-wider text-sm">
                    Explore Collection
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-xl font-heading font-semibold text-primary group-hover:text-accent transition-colors">
                  {collection.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
