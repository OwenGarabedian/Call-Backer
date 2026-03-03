import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingContext from "./pages/PricingContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Messages from "./pages/Messages";
import DatabaseScreen from "./pages/Database";
import TextProfile from "./pages/TextProfile";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import AutomationConfig from "./pages/AutomationConfig";
import BusinessKnowledge from "./pages/BusinessKnowledge";
import ControlCenter from "./pages/ControlCenter";
import Support from "./pages/Support";
import Payment from "./pages/Payment";
import HowItWorks from "./pages/HowItWorks";
import DemoDashboard from "./pages/DemoDashboard";
import DemoCalls from "./pages/DemoCalls";
import DemoMessages from "./pages/DemoMessages";
import DemoDatabase from "./pages/DemoDatabase";
import DemoControlCenter from "./pages/DemoControlCenter";
import DemoSettings from "./pages/DemoSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Pricing" element={<PricingContext />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/database" element={<DatabaseScreen />} />
          <Route path="/text-profile" element={<TextProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profileSettings" element={<ProfileSettings />} />
          <Route path="/automationConfig" element={<AutomationConfig />} />
          <Route path="/businessKnowledge" element={<BusinessKnowledge />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/support" element={<Support />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ── DEMO ROUTES (no auth required) ── */}
          <Route path="/demo" element={<DemoDashboard />} />
          <Route path="/demo/calls" element={<DemoCalls />} />
          <Route path="/demo/messages" element={<DemoMessages />} />
          <Route path="/demo/database" element={<DemoDatabase />} />
          <Route path="/demo/control-center" element={<DemoControlCenter />} />
          <Route path="/demo/settings" element={<DemoSettings />} />
          <Route path="/demo/billing" element={<DemoSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
