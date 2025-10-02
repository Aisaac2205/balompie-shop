import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { CartProvider } from "@/hooks/use-cart";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Teams from "./pages/Teams";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/Checkout";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import TeamsAdmin from "./pages/admin/Teams";
import PatchesAdmin from "./pages/admin/Patches";
import SettingsAdmin from "./pages/admin/Settings";
import HeroImagesAdmin from "./pages/admin/HeroImages";
import { DebugConnection } from "./components/debug/DebugConnection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="balompie-theme">
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              
              {/* Debug Route (temporal) */}
              <Route path="/debug" element={<DebugConnection />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="teams" element={<TeamsAdmin />} />
                <Route path="patches" element={<PatchesAdmin />} />
                <Route path="hero-images" element={<HeroImagesAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
