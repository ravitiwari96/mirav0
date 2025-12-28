import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Package, Settings, LogOut, ShoppingBag, ChevronRight, MapPin, Heart, Leaf, Award, Camera, Loader2, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import miravoLogo from "@/assets/miravo-logo-new.png";

interface ShopifyOrder {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        image?: { url: string };
      };
    }>;
  };
}

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Editable fields
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState("");

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  // Fetch orders from Shopify
  useEffect(() => {
    const fetchOrders = async () => {
      if (!profile?.shopify_customer_id && !profile?.email) return;
      
      setIsLoadingOrders(true);
      try {
        const { data, error } = await supabase.functions.invoke('sync-shopify-customer', {
          body: {
            action: 'get_orders',
            shopify_customer_id: profile?.shopify_customer_id,
            email: profile?.email
          }
        });

        if (error) throw error;
        if (data?.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, profile?.shopify_customer_id, profile?.email]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({ full_name: fullName });
    setIsSaving(false);
    
    if (error) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploadingAvatar(true);
    const { error } = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (error) {
      toast.error("Failed to upload avatar");
    } else {
      toast.success("Avatar updated!");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const navItems = [
    { id: "profile", icon: User, label: "My Profile" },
    { id: "orders", icon: Package, label: "My Orders" },
    { id: "addresses", icon: MapPin, label: "Addresses" },
    { id: "wishlist", icon: Heart, label: "Saved Items" },
    { id: "rewards", icon: Award, label: "Green Rewards" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <img src={miravoLogo} alt="MIRAVO" className="h-8 md:h-10 w-auto" />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">My Account</h1>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* User Info */}
                <div className="text-center">
                  <div className="relative mx-auto mb-3 md:mb-4 inline-block">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-accent/20 overflow-hidden bg-muted">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10">
                          <User className="w-10 h-10 text-accent/50" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
                    >
                      {isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg text-foreground">
                    {profile?.full_name || user?.email?.split('@')[0] || 'Customer'}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 md:space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                        activeTab === item.id
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  ))}
                </nav>

                {/* Sign Out */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                  Sign Out
                </Button>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
                    Profile Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-11 md:h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        className="h-11 md:h-12 rounded-xl bg-muted"
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 md:h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="mt-6 md:mt-8 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 md:h-12 px-6"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </Card>
              )}

              {activeTab === "orders" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">
                    Order History
                  </h2>
                  {isLoadingOrders ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
                      <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 md:py-16">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6 text-sm md:text-base">
                        Browse our store to place your first order.
                      </p>
                      <Button
                        onClick={() => navigate("/shop")}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 md:h-12 px-6"
                      >
                        Go to Shop
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-muted/30 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{order.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {order.totalPriceSet.shopMoney.currencyCode} {order.totalPriceSet.shopMoney.amount}
                              </p>
                              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                                {order.displayFulfillmentStatus || 'Processing'}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.lineItems.edges.slice(0, 3).map((item, i) => (
                              <span key={i}>
                                {item.node.title} × {item.node.quantity}
                                {i < Math.min(order.lineItems.edges.length, 3) - 1 && ", "}
                              </span>
                            ))}
                            {order.lineItems.edges.length > 3 && ` +${order.lineItems.edges.length - 3} more`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {activeTab === "addresses" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">Saved Addresses</h2>
                  <div className="text-center py-12 md:py-16">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <MapPin className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No addresses saved</h3>
                    <p className="text-muted-foreground mb-6">Add a delivery address for faster checkout.</p>
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 md:h-12 px-6">
                      Add New Address
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === "wishlist" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">Saved Items</h2>
                  <div className="text-center py-12 md:py-16">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <Heart className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No saved items yet</h3>
                    <p className="text-muted-foreground mb-6">Save products you love for later.</p>
                    <Button onClick={() => navigate("/shop")} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 md:h-12 px-6">
                      Browse Products
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === "rewards" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">MIRAVO Green Rewards</h2>
                  <div className="text-center py-12 md:py-16">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <Leaf className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Start Earning Rewards</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Make sustainable purchases and earn points towards exclusive discounts.
                    </p>
                    <Button onClick={() => navigate("/rewards")} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-11 md:h-12 px-6">
                      Explore Rewards
                    </Button>
                  </div>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-foreground">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive updates about orders and promotions</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-foreground">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">Update</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm" className="rounded-lg">Delete</Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
