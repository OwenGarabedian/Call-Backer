import { motion } from "framer-motion";
import { Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
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

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="signin-email">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="signin-password">
                  Password
                </label>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-200 mt-2 shadow-sm"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
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
