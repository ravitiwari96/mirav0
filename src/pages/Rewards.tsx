import { useState } from "react";
import { Link2, Share2, ShoppingBag, Instagram, MessageSquare, Users, Gift, Sprout, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const Rewards = () => {
  const [points, setPoints] = useState(0);
  const [referralCode] = useState("MIRAVO-ECO2024");
  const { toast } = useToast();

  const getTier = (pts: number) => {
    if (pts >= 5000) return { name: "Bamboo Circle", icon: "🎋", level: 3 };
    if (pts >= 1000) return { name: "Sprout", icon: "🌿", level: 2 };
    return { name: "Seed", icon: "🌱", level: 1 };
  };

  const tier = getTier(points);
  const nextTier = tier.level === 3 ? null : tier.level === 2 ? 5000 : 1000;
  const progress = nextTier ? (points / nextTier) * 100 : 100;

  const earningActions = [
    {
      icon: ShoppingBag,
      title: "Shop Sustainable Products",
      description: "Earn 5 points for every ₹100 spent",
      points: "5 pts/₹100",
      action: () => toast({ title: "Start Shopping", description: "Visit our shop to earn points!" }),
    },
    {
      icon: Instagram,
      title: "Follow on Instagram",
      description: "Connect with @miravo.eco",
      points: "+50 pts",
      action: () => window.open("https://www.instagram.com/miravo.eco/", "_blank"),
    },
    {
      icon: MessageSquare,
      title: "Leave a Review",
      description: "Share your experience",
      points: "+100 pts",
      action: () => toast({ title: "Coming Soon", description: "Review system launching soon!" }),
    },
    {
      icon: Users,
      title: "Refer a Friend",
      description: "You both get rewards",
      points: "₹250 off each",
      action: () => {},
    },
  ];

  const rewards = [
    { name: "₹250 Off Next Order", points: 2500, description: "Minimum purchase ₹1000" },
    { name: "10% Off Sustainable Bundles", points: 4000, description: "Valid on all bundle products" },
    { name: "Free Bamboo Toothbrush", points: 6000, description: "Best-selling eco toothbrush" },
    { name: "₹500 Off Premium Items", points: 8000, description: "On items ₹2000+" },
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              MIRAVO Green Rewards
            </h1>
            <p className="text-xl text-muted-foreground">
              Earn points for every sustainable choice. Redeem for exclusive rewards.
            </p>
          </div>

          {/* Current Status Card */}
          <Card className="max-w-2xl mx-auto mb-12 border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Your Green Points</CardTitle>
                  <CardDescription>Current Tier: {tier.icon} {tier.name}</CardDescription>
                </div>
                <div className="text-4xl font-bold text-primary">{points}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {nextTier ? (tier.level === 1 ? "Sprout 🌿" : "Bamboo Circle 🎋") : "Max Level"}</span>
                  {nextTier && <span>{points}/{nextTier} pts</span>}
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              {nextTier && (
                <p className="text-sm text-muted-foreground">
                  {nextTier - points} points until next tier
                </p>
              )}
            </CardContent>
          </Card>

          {/* Ways to Earn */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Ways to Earn Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {earningActions.map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <action.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                      <p className="text-primary font-bold">{action.points}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Referral Section */}
          <Card className="mb-16 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Share2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Refer & Earn</h2>
                  <p className="text-muted-foreground">
                    Share your unique code. When friends shop, you both get ₹250 off!
                  </p>
                </div>
                <div className="flex gap-2 max-w-md mx-auto">
                  <Input
                    value={referralCode}
                    readOnly
                    className="text-center font-mono text-lg"
                  />
                  <Button onClick={copyReferralCode} variant="outline" className="whitespace-nowrap">
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Grid */}
          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Redeem Your Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewards.map((reward, index) => (
                <Card key={index} className={points >= reward.points ? "border-primary" : ""}>
                  <CardHeader>
                    <Gift className={`h-8 w-8 mb-2 ${points >= reward.points ? "text-primary" : "text-muted-foreground"}`} />
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-primary">{reward.points} pts</div>
                      <Button
                        className="w-full"
                        disabled={points < reward.points}
                        onClick={() => {
                          if (points >= reward.points) {
                            toast({
                              title: "Reward Redeemed! 🎉",
                              description: `${reward.name} has been added to your account.`,
                            });
                            setPoints(points - reward.points);
                          }
                        }}
                      >
                        {points >= reward.points ? "Redeem Now" : `Need ${reward.points - points} pts`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tier Benefits */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Membership Tiers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className={tier.level === 1 ? "border-primary" : ""}>
                <CardHeader>
                  <div className="text-4xl mb-2">🌱</div>
                  <CardTitle>Seed</CardTitle>
                  <CardDescription>0 - 999 points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Earn points on purchases</li>
                    <li>• Exclusive member offers</li>
                    <li>• Early sale access</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={tier.level === 2 ? "border-primary" : ""}>
                <CardHeader>
                  <div className="text-4xl mb-2">🌿</div>
                  <CardTitle>Sprout</CardTitle>
                  <CardDescription>1,000 - 4,999 points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All Seed benefits</li>
                    <li>• 2x points on birthdays</li>
                    <li>• Free express shipping</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className={tier.level === 3 ? "border-primary" : ""}>
                <CardHeader>
                  <div className="text-4xl mb-2">🎋</div>
                  <CardTitle>Bamboo Circle</CardTitle>
                  <CardDescription>5,000+ points</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• All Sprout benefits</li>
                    <li>• VIP customer support</li>
                    <li>• Exclusive product previews</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
