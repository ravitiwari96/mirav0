import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import miravoLogo from '@/assets/miravo-logo-new.png';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={miravoLogo} alt="MIRAVO" className="h-12 mx-auto mb-4" />
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with the original location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
