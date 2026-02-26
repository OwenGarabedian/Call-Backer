import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const verifyEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!verifyEmail()) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    setLoading(false);

    if (insertError) {
      if (insertError.code === "23505") {
        // unique violation — already on waitlist
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    setSubmitted(true);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #ede9f9 100%)" }}
    >
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

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center py-6 gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold mb-2">You're on the list!</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We'll reach out to <span className="font-medium text-foreground">{email}</span> as soon as early access opens up.
                  </p>
                </div>
                <Link
                  to="/"
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                >
                  Back to home
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-2xl font-bold mb-1">Join the waitlist</h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Be first in line when Call Backer opens up. No spam, ever.
                </p>

                <form className="space-y-4" onSubmit={handleWaitlist}>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      className="text-sm font-medium uppercase tracking-wider text-xs opacity-80"
                      htmlFor="waitlist-email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <input
                        id="waitlist-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="name@company.com"
                        autoComplete="email"
                        className="w-full pl-10 pr-4 py-3 text-sm bg-background/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring placeholder-muted-foreground transition"
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
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
                        Joining...
                      </>
                    ) : (
                      "Request Early Access"
                    )}
                  </motion.button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="font-semibold text-foreground hover:underline">
                    Sign In
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}