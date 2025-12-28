import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Loader2, Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
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

// Password strength checker
const getPasswordStrength = (password: string) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  if (checks.length) score += 20;
  if (checks.uppercase) score += 20;
  if (checks.lowercase) score += 20;
  if (checks.number) score += 20;
  if (checks.special) score += 20;

  return { score, checks };
};

const getStrengthLabel = (score: number) => {
  if (score <= 20) return { label: "Very Weak", color: "bg-destructive" };
  if (score <= 40) return { label: "Weak", color: "bg-orange-500" };
  if (score <= 60) return { label: "Fair", color: "bg-yellow-500" };
  if (score <= 80) return { label: "Good", color: "bg-lime-500" };
  return { label: "Strong", color: "bg-green-500" };
};

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, user, isLoading: authLoading } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(passwordStrength.score);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/account", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (passwordStrength.score < 60) {
      setError("Please choose a stronger password (include uppercase, number, and special character)");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      return;
    }
    
    setIsLoading(true);
    
    const fullName = `${firstName} ${lastName}`.trim();
    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setIsLoading(false);
      
      // Handle specific error messages
      if (signUpError.message.includes("already registered")) {
        setError("This email is already registered. Please sign in instead.");
      } else if (signUpError.message.includes("invalid")) {
        setError("Please enter a valid email address");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);
    toast.success("Account created successfully!");
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

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-accent/5 to-background">
        <header className="py-6 px-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto">
            <Link to="/">
              <img src={miravoLogo} alt="MIRAVO" className="h-10 w-auto" />
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md p-8 shadow-elegant border-border/50 text-center">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Welcome to MIRAVO!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your account has been created successfully. You can now sign in to start your sustainable journey.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
            >
              Sign In Now
            </Button>
          </Card>
        </main>

        <footer className="py-6 px-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 MIRAVO. Sustainable Essentials for Everyday Living.
            </p>
          </div>
        </footer>
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
              Join MIRAVO
            </h1>
            <p className="text-muted-foreground">
              Create your account and start your sustainable journey
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError(null);
                  }}
                  placeholder="First"
                  required
                  autoComplete="given-name"
                  className="h-12 rounded-xl border-2 border-border/50 focus:border-accent px-4"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Last"
                  required
                  autoComplete="family-name"
                  className="h-12 rounded-xl border-2 border-border/50 focus:border-accent px-4"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
              
              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength.score >= 60 ? 'text-green-600' : 'text-orange-500'}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <Progress value={passwordStrength.score} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                      <div key={key} className="flex items-center gap-1">
                        {passed ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className={passed ? "text-green-600" : "text-muted-foreground"}>
                          {key === "length" && "8+ characters"}
                          {key === "uppercase" && "Uppercase"}
                          {key === "lowercase" && "Lowercase"}
                          {key === "number" && "Number"}
                          {key === "special" && "Special char"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={`h-12 rounded-xl border-2 px-4 pr-12 ${
                    confirmPassword && password !== confirmPassword 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border/50 focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">Passwords do not match</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => {
                  setAcceptTerms(checked as boolean);
                  setError(null);
                }}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
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

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                setIsGoogleLoading(true);
                setError(null);
                const { error } = await signInWithGoogle();
                if (error) {
                  setError("Failed to sign up with Google. Please try again.");
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-accent hover:text-accent/80 font-semibold transition-colors"
              >
                Sign In
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

export default Signup;
