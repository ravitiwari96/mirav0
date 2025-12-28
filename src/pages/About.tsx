import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Award, Users, Heart } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "100% Sustainable",
    description:
      "Every product is crafted from FSC-certified bamboo, ensuring responsible forestry practices.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "We never compromise on quality. Our products are designed to last and perform beautifully.",
  },
  {
    icon: Users,
    title: "Ethical Production",
    description:
      "Fair wages, safe working conditions, and community support are at the heart of our supply chain.",
  },
  {
    icon: Heart,
    title: "Impact Driven",
    description:
      "With every purchase, you're contributing to reforestation efforts and plastic reduction initiatives.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              <Leaf className="h-4 w-4" />
              Our Story
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary">
              Redefining Sustainable Living
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              MIRAVO was born from a simple belief: that everyday essentials
              can be both elegant and environmentally responsible. We're on a
              mission to replace single-use plastic with beautiful, durable
              bamboo alternatives.
            </p>
          </div>
        </section>

        {/* Mission Image */}
        <section className="container mx-auto px-4 mb-20">
          <div className="relative h-[500px] rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=500&fit=crop"
              alt="Bamboo forest"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent flex items-end">
              <div className="p-12 text-white space-y-4 max-w-2xl">
                <h2 className="text-4xl font-heading font-bold">
                  From Forest to Your Home
                </h2>
                <p className="text-lg opacity-90">
                  Every MIRAVO product begins in sustainably managed bamboo
                  forests, where we work directly with local communities to
                  ensure responsible harvesting practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-muted-foreground">
                Our values guide every decision we make, from sourcing to
                packaging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="text-center space-y-4 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:shadow-hover transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center">
                      <div className="p-4 rounded-full bg-accent/10 border border-accent/20">
                        <Icon className="h-8 w-8 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-primary">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              Certified & Trusted
            </h2>
            <p className="text-lg text-muted-foreground">
              Our commitment to sustainability is backed by industry-recognized
              certifications and transparent supply chain practices.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center space-y-2">
                <div className="text-4xl">🌳</div>
                <div className="font-semibold text-primary">FSC Certified</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl">♻️</div>
                <div className="font-semibold text-primary">100% Plastic-Free</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl">🌿</div>
                <div className="font-semibold text-primary">Carbon Neutral</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl">🤝</div>
                <div className="font-semibold text-primary">Fair Trade</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
