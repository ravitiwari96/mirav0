import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { validateCartSession } from "@/stores/cartStore";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import ShopifyProduct from "./pages/ShopifyProduct";
import Rewards from "./pages/Rewards";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Collections from "./pages/Collections";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Validate cart session on app load
const AppContent = () => {
  useEffect(() => {
    validateCartSession();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/product/:handle" element={<ShopifyProduct />} />
        <Route path="/product/demo/:id" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
