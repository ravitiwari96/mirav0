import { Star, User } from "lucide-react";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Shubhi Gupta",
    role: "Project Manager",
    content:
      "Switched our entire bathroom to MIRAVO products. The bamboo toothbrushes are amazing, and my kids love them! Feels great knowing we're reducing plastic waste.",
    rating: 5,
    gender: "female",
  },
  {
    name: "Manish Shukla",
    role: "Business Analyst",
    content:
      "The quality is exceptional. These aren't just eco-friendly alternatives - they're genuinely better products. The bamboo cutlery set is elegant and durable.",
    rating: 5,
    gender: "male",
  },
  {
    name: "Nikita Pandey",
    role: "Social Media Manager",
    content:
      "Love the aesthetic! The bamboo kitchenware looks beautiful in my home. Plus, knowing each purchase helps the planet makes it even more special.",
    rating: 5,
    gender: "female",
  },
];

const FemaleAvatar = () => (
  <svg viewBox="0 0 64 64" className="h-12 w-12">
    <circle cx="32" cy="32" r="30" fill="hsl(var(--accent) / 0.15)" />
    <circle cx="32" cy="24" r="12" fill="hsl(var(--accent) / 0.4)" />
    <path
      d="M16 52c0-12 7.2-18 16-18s16 6 16 18"
      fill="hsl(var(--accent) / 0.4)"
    />
    <ellipse cx="32" cy="8" rx="14" ry="6" fill="hsl(var(--accent) / 0.3)" />
    <path
      d="M18 12c-2 8 0 16 0 16s-2-12 4-18c4-4 16-4 20 0 6 6 4 18 4 18s2-8 0-16c-1-4-6-8-14-8s-13 4-14 8z"
      fill="hsl(var(--accent) / 0.3)"
    />
  </svg>
);

const MaleAvatar = () => (
  <svg viewBox="0 0 64 64" className="h-12 w-12">
    <circle cx="32" cy="32" r="30" fill="hsl(var(--primary) / 0.15)" />
    <circle cx="32" cy="24" r="12" fill="hsl(var(--primary) / 0.4)" />
    <path
      d="M16 52c0-12 7.2-18 16-18s16 6 16 18"
      fill="hsl(var(--primary) / 0.4)"
    />
    <rect x="20" y="6" width="24" height="10" rx="2" fill="hsl(var(--primary) / 0.3)" />
  </svg>
);

const Testimonials = () => {
  return (
    <section className="py-20 container mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary">
          Loved by Eco Warriors
        </h2>
        <p className="text-lg text-muted-foreground">
          Join thousands of customers making sustainable choices every day.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="p-6 space-y-4 border-border/50 hover:shadow-hover transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-gold text-gold"
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-muted-foreground italic">
              "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="rounded-full border-2 border-accent/20 overflow-hidden">
                {testimonial.gender === "female" ? <FemaleAvatar /> : <MaleAvatar />}
              </div>
              <div>
                <div className="font-semibold text-primary">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
