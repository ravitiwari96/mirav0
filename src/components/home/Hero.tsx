import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bamboo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/40 md:from-background/85 md:via-background/60 md:to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-0">
        <div className="max-w-2xl space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-sm font-semibold shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
            100% Sustainable Bamboo Products
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-[#1A1A1A] leading-tight drop-shadow-sm">
            Nature's Touch in Every Product
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-[#333333] max-w-xl font-medium">
            Redefining sustainable living with elegant, durable bamboo-based
            everyday essentials. Pure. Durable. Sustainable.
          </p>

          {/* CTAs - Equal sizing */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-10 bg-primary text-primary-foreground rounded-full font-semibold uppercase tracking-wider text-base hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop Now
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-10 bg-background/60 backdrop-blur-sm border-2 border-primary text-primary rounded-full font-semibold uppercase tracking-wider text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Our Story
              </Button>
            </Link>
          </div>

          {/* Impact Stats - Updated to be realistic */}
          <div className="flex flex-wrap gap-6 md:gap-10 pt-8 md:pt-10">
            <div className="space-y-1 bg-background/40 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                Target: 50K
              </div>
              <div className="text-xs md:text-sm text-[#444444] uppercase tracking-wider font-medium">
                kg Plastic to Save
              </div>
            </div>
            <div className="space-y-1 bg-background/40 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                500+
              </div>
              <div className="text-xs md:text-sm text-[#444444] uppercase tracking-wider font-medium">
                Happy Customers
              </div>
            </div>
            <div className="space-y-1 bg-background/40 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                100%
              </div>
              <div className="text-xs md:text-sm text-[#444444] uppercase tracking-wider font-medium">
                FSC Certified
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <div className="h-12 w-6 rounded-full border-2 border-primary flex items-start justify-center p-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;