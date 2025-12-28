import { Leaf, Droplets, Trees, Recycle, Target } from "lucide-react";

const impacts = [
  {
    icon: Target,
    value: "50,000",
    unit: "kg",
    label: "Plastic Save Target",
    color: "text-accent",
    isTarget: true,
  },
  {
    icon: Trees,
    value: "500",
    unit: "+",
    label: "Trees to Plant",
    color: "text-primary",
    isTarget: true,
  },
  {
    icon: Droplets,
    value: "10K",
    unit: "L",
    label: "Water Conservation Goal",
    color: "text-accent",
    isTarget: true,
  },
  {
    icon: Leaf,
    value: "500",
    unit: "+",
    label: "Happy Customers",
    color: "text-primary",
    isTarget: false,
  },
];

const ImpactCounter = () => {
  return (
    <section className="py-16 md:py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-[#1A1A1A]">
            Our Sustainability Goals
          </h2>
          <p className="text-base md:text-lg text-[#444444]">
            Together, we're building a greener future. Join us on this journey to make a lasting impact.
          </p>
        </div>

        {/* Impact Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {impacts.map((impact, index) => {
            const Icon = impact.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:shadow-hover transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center">
                  <div className="p-3 md:p-4 rounded-full bg-accent/10 border border-accent/20">
                    <Icon className={`h-6 w-6 md:h-8 md:w-8 ${impact.color}`} />
                  </div>
                </div>
                <div>
                  {impact.isTarget && (
                    <span className="text-xs text-accent font-semibold uppercase tracking-wider">
                      Target
                    </span>
                  )}
                  <div className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[#1A1A1A]">
                    {impact.value}
                    <span className="text-lg md:text-xl text-[#666666] ml-1">
                      {impact.unit}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm uppercase tracking-wider text-[#555555] mt-1 md:mt-2 font-medium">
                    {impact.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10 md:mt-14">
          <p className="text-base md:text-lg text-[#444444] font-medium">
            Join us in making sustainable choices every day 🌿
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactCounter;