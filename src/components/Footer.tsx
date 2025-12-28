import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-16">
      {/* Newsletter Section */}
      <div className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            Join The MIRAVO Edit
          </h2>
          <p className="text-lg mb-1">Enjoy 15% Off</p>
          <p className="text-background/70 mb-6">
            Be the first to discover new launches.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-background/10 border-background/20 text-background placeholder:text-background/50"
            />
            <Button className="h-12 px-8 bg-background text-foreground hover:bg-background/90 font-semibold tracking-wider">
              JOIN
            </Button>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium tracking-wider mb-8">
          <Link to="/about" className="text-foreground hover:text-accent transition-colors">
            ABOUT
          </Link>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            DELIVERY
          </a>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            FAQS
          </a>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <Link to="/rewards" className="text-foreground hover:text-accent transition-colors">
            REWARDS
          </Link>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <Link to="/contact" className="text-foreground hover:text-accent transition-colors">
            CONTACT US
          </Link>
          <span className="text-muted-foreground hidden md:inline">|</span>
          <a href="#" className="text-foreground hover:text-accent transition-colors">
            RETURNS
          </a>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            MIRAVO
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
            <a href="https://www.instagram.com/miravo.eco/" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
            </a>
          </Button>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MIRAVO. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
