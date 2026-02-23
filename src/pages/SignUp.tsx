import { motion } from "framer-motion";
import { Phone, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignUp() {
  const navigate = useNavigate();

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation Checkers
  const verifyEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const checkIfEmailExists = async (inputEmail: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", inputEmail.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("Check error:", error.message);
      return false;
    }

    return !!data;
  };

  // Submit Handler
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Check email format
    if (!verifyEmail()) {
      alert("Invalid Email: Please enter a valid work email address.");
      setLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email is already in use
    const exists = await checkIfEmailExists(cleanEmail);
    if (exists) {
      alert("Account Exists: This email is already registered. Please sign in instead.");
      setLoading(false);
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (password.length < 8) {
      alert("Weak Password: Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      alert("Weak Password: Include at least one number and one special character.");
      setLoading(false);
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      alert("Mismatch: Passwords do not match.");
      setLoading(false);
      return;
    }

    // Register User
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      alert("Registration Error: " + error.message);
      setLoading(false);
      return;
    }

    // Route to Onboarding on success
    if (data.user) {
      // Pass the user ID to the next route via React Router state
      navigate("/onboarding", { state: { id: data.user.id } });
      setLoading(false);
    }
  }

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

          <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Start automating leads in 60s — no credit card required.
          </p>

          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium uppercase tracking-wider text-xs opacity-80" htmlFor="signup-email">
                Work Email
              </label>
              <input
                id="signup-email"
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
              <label className="text-sm font-medium uppercase tracking-wider text-xs opacity-80" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium uppercase tracking-wider text-xs opacity-80" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-11 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">Terms</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-semibold text-foreground hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}