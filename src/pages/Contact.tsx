import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our products or sustainability practices? We'd
              love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-heading font-semibold text-primary mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>

                  <Button className="w-full bg-primary hover:bg-accent">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 border border-accent/20">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-primary">Email</div>
                      <div className="text-sm text-muted-foreground">
                        info@miravo.com
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 border border-accent/20">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-primary">Phone</div>
                      <div className="text-sm text-muted-foreground">
                        +91 9625361957
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-accent/10 border border-accent/20">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-primary">Address</div>
                      <div className="text-sm text-muted-foreground">
                        Alok Nagar
                        <br />
                        Indore 452010
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-heading font-semibold text-primary">
                  Follow Our Journey
                </h2>
                <p className="text-sm text-muted-foreground">
                  Stay updated with sustainable living tips, product launches, and
                  behind-the-scenes content.
                </p>

                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 border-accent/20 hover:bg-accent/10"
                    asChild
                  >
                    <a href="https://www.instagram.com/miravo.eco/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 border-accent/20 hover:bg-accent/10"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 border-accent/20 hover:bg-accent/10"
                  >
                    <Youtube className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
                <h2 className="text-2xl font-heading font-semibold text-primary">
                  Customer Service Hours
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
