import { motion } from "framer-motion";
import { Phone, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

interface UserData {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  phone_number: string;
  website_url: string;
  status: string;
  text_on: boolean;
  call_on: boolean;
  created_at: string;
  completed: boolean;
  EIN: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
}

export default function SignIn() {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation
  const verifyEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  // Fetch User Data
  const fetchTableValues = async (): Promise<UserData | null> => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", cleanEmail)
        .single();

      if (error) {
        alert("Account Sync: We couldn't find your profile details. Please contact support.");
        return null;
      }

      return data;
    } catch (err) {
      alert("Error: An unexpected error occurred while fetching your data.");
      return null;
    }
  };

  // Routing Logic based on profile completeness and subscriptions
  const handleRoutingBasedOnProfile = async (userData: UserData | null) => {
    if (!userData) {
      alert("Error: No user data found. Please try again.");
      return;
    }

    // Pass ID to the next routes via state
    const routeState = { state: { id: userData.id } };

    if (userData.completed) {
      try {
        const [settingsRes, twilioRes] = await Promise.all([
          supabase
            .from("user_settings")
            .select("month_paid")
            .eq("user_id", userData.id)
            .single(),
          supabase
            .from("twilio_profiles")
            .select("status")
            .eq("user_id", userData.id)
            .single(),
        ]);

        const isMonthPaid = settingsRes.data?.month_paid === true;
        const twilioStatus = twilioRes.data?.status;

        // Payment check routing
        if (!isMonthPaid && twilioStatus !== "pending") {
          navigate("/payment", routeState); 
          return; 
        }
      } catch (error) {
        console.error("Error verifying payment status on login:", error);
      }

      // Success routing
      navigate("/dashboard", routeState);
      return;
    }

    // Incomplete Profile Routing
    const { full_name, phone_number, business_name, website_url, street } = userData;

    if (!full_name || !phone_number) {
      navigate("/onboarding/name-phone", routeState);
    } else if (!business_name || !website_url) {
      navigate("/onboarding/business", routeState);
    } else if (!street) {
      navigate("/onboarding/location", routeState);
    } else {
      navigate("/order-number", routeState);
    }
  };

  // Submit Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!verifyEmail()) {
      alert("Invalid Email: Please enter a valid work email address.");
      setLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Authenticate with Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return; 
    }

    // Fetch and Route
    const fetchedUserData = await fetchTableValues();
    await handleRoutingBasedOnProfile(fetchedUserData);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #ede9f9 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-base font-bold tracking-tight">Call Backer</span>
          </Link>

          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to your account to continue.
          </p>

          <form className="space-y-4" onSubmit={handleSignIn}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium uppercase tracking-wider text-xs opacity-80" htmlFor="signin-email">
                Work Email
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium uppercase tracking-wider text-xs opacity-80" htmlFor="signin-password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-200 mt-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="font-semibold text-foreground hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}