import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  Heart,
  Leaf,
  Award,
  Package,
  Truck,
  ChevronLeft,
} from "lucide-react";
import bambooToothbrush from "@/assets/bamboo-toothbrush.png";
import bambooMug from "@/assets/bamboo-mug.png";
import bambooBottle from "@/assets/bamboo-bottle.png";

const Product = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data
  const product = {
    id: 1,
    name: "Bamboo Toothbrush",
    price: 120,
    category: "Toothbrush",
    images: [
      bambooToothbrush,
      bambooToothbrush,
      bambooToothbrush,
    ],
    description:
      "Make the switch to sustainable oral care with our premium bamboo toothbrush set. Each brush features soft, BPA-free bristles and an ergonomically designed bamboo handle that's naturally antibacterial and biodegradable.",
    impact: "Saves 50g plastic per brush",
    features: [
      "100% biodegradable bamboo handle",
      "BPA-free soft bristles",
      "Naturally antibacterial",
      "Ergonomic design",
      "FSC certified bamboo",
      "Plastic-free packaging",
    ],
    certifications: ["FSC Certified", "Vegan", "Cruelty-Free", "Plastic-Free"],
  };

  const relatedProducts = [
    {
      id: 2,
      name: "Bamboo Coffee Mug",
      price: 320,
      image: bambooMug,
    },
    {
      id: 3,
      name: "Bamboo Water Bottle",
      price: 550,
      image: bambooBottle,
    },
    {
      id: 4,
      name: "Bamboo Toothbrush",
      price: 120,
      image: bambooToothbrush,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-secondary/30 to-secondary/10">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </div>
                <h1 className="text-4xl font-heading font-bold text-primary mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-eco">
                    <Leaf className="h-3 w-3" />
                    {product.impact}
                  </span>
                  {product.certifications.map((cert, i) => (
                    <span key={i} className="badge-eco">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-4xl font-heading font-bold text-primary">
                ₹{product.price}
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4"
                  >
                    -
                  </Button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-primary hover:bg-accent gap-2 py-6">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-auto w-auto px-6 py-6 border-2"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6">
                <h3 className="font-heading font-semibold text-lg text-primary">
                  Product Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20 border border-border">
                  <Truck className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <div className="font-medium text-sm">Free Shipping</div>
                    <div className="text-xs text-muted-foreground">
                      On orders over $50
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/20 border border-border">
                  <Package className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <div className="font-medium text-sm">Eco Packaging</div>
                    <div className="text-xs text-muted-foreground">
                      100% plastic-free
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section>
            <h2 className="text-3xl font-heading font-bold text-primary mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`}>
                  <Card className="product-card overflow-hidden border-border/50 group">
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-secondary/30 to-secondary/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-heading font-semibold text-primary group-hover:text-accent transition-colors">
                        {item.name}
                      </h3>
                      <div className="text-xl font-heading font-bold text-primary">
                        ₹{item.price}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
