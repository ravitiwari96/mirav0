import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Eye, EyeOff, AlertCircle, Check, X, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import miravoLogo from "@/assets/miravo-logo-new.png";

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

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(passwordStrength.score);

  // Check if user came from reset link (has active session from email link)
  useEffect(() => {
    // The session should be set from the email reset link
    if (!session && !isSuccess) {
      // Give it a moment to load
      const timer = setTimeout(() => {
        if (!session) {
          toast.error("Invalid or expired reset link. Please request a new one.");
          navigate("/forgot-password");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [session, navigate, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (passwordStrength.score < 60) {
      setError("Please choose a stronger password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    const { error: updateError } = await updatePassword(password);

    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setIsSuccess(true);
    toast.success("Password updated successfully!");
  };

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
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Password Updated!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
            >
              Sign In
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
          <div className="text-center mb-8">
            <img src={miravoLogo} alt="MIRAVO" className="h-10 w-auto mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Set New Password
            </h1>
            <p className="text-muted-foreground">
              Enter your new password below
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
              <Label htmlFor="password" className="text-foreground">New Password</Label>
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
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

export default ResetPassword;
