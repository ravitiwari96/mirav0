import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    const { error: resetError } = await resetPassword(email);

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setIsSubmitted(true);
  };

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

          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Enter your email and we'll send you a reset link
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setError(null);
                  }}
                  className="text-accent hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
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

export default ForgotPassword;
