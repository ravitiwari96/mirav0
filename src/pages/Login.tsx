import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import miravoLogo from "@/assets/miravo-logo-new.png";

// Female avatar component for branding
const FemaleAvatar = () => (
  <svg viewBox="0 0 64 64" className="h-16 w-16">
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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, user, isLoading: authLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get redirect path from location state
  const from = (location.state as { from?: Location })?.from?.pathname || "/account";

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setIsLoading(false);
      
      // Handle specific error messages
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (signInError.message.includes("Email not confirmed")) {
        setError("Please verify your email before signing in. Check your inbox for a verification link.");
      } else {
        setError(signInError.message);
      }
      return;
    }

    toast.success("Welcome back to MIRAVO!");
    navigate(from, { replace: true });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={miravoLogo} alt="MIRAVO" className="h-12 mx-auto mb-4" />
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="py-6 px-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <Link to="/">
            <img src={miravoLogo} alt="MIRAVO" className="h-10 w-auto" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md p-8 shadow-elegant border-border/50">
          {/* Logo with Avatar */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src={miravoLogo} alt="MIRAVO" className="h-10 w-auto" />
            <div className="h-8 w-px bg-border" />
            <FemaleAvatar />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your MIRAVO account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-12 rounded-xl border-2 border-border/50 focus:border-accent px-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-2 border-border/50 focus:border-accent px-4 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setIsGoogleLoading(true);
                setError(null);
                const { error } = await signInWithGoogle();
                if (error) {
                  setError("Failed to sign in with Google. Please try again.");
                }
                setIsGoogleLoading(false);
              }}
              disabled={isGoogleLoading}
              className="w-full h-12 rounded-xl border-2 border-border/50 hover:border-accent"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 MIRAVO. Sustainable Essentials for Everyday Living.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
