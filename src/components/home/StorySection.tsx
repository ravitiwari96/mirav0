import { Sprout, Palette, Package, Heart } from "lucide-react";

const steps = [
  {
    icon: Sprout,
    title: "Sourced from Nature",
    description:
      "We use 100% FSC-certified bamboo, harvested sustainably from managed forests.",
  },
  {
    icon: Palette,
    title: "Crafted with Care",
    description:
      "Skilled artisans transform raw bamboo into beautiful, functional products.",
  },
  {
    icon: Package,
    title: "Packaged Mindfully",
    description:
      "Plastic-free packaging using recycled and biodegradable materials.",
  },
  {
    icon: Heart,
    title: "Loved by You",
    description:
      "Every purchase supports sustainable livelihoods and a healthier planet.",
  },
];

const StorySection = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
          From Forest to Your Home
        </h2>
        <p className="text-lg text-muted-foreground">
          Our journey is rooted in respect for nature and commitment to
          sustainable craftsmanship. Every product tells a story of
          environmental stewardship.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent opacity-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center space-y-4 animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="p-6 rounded-full bg-accent/10 border-2 border-accent/30 backdrop-blur-sm">
                      <Icon className="h-10 w-10 text-accent" />
                    </div>
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-semibold text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a
          href="/about"
          className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-medium"
        >
          Learn more about our story
          <span className="text-xl">→</span>
        </a>
      </div>
    </section>
  );
};

export default StorySection;
