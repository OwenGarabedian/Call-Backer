import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, User, MessageCircle, Split, CalendarDays,
  Star, Sliders, Tags, HelpCircle, ChevronRight, ShieldCheck, LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { DEMO_USER } from "@/lib/demoData";

export default function DemoSettings() {
  const navigate = useNavigate();

  // Demo-local toggle state (no Supabase — purely visual)
  const [isTextAutoOn, setIsTextAutoOn] = useState(true);
  const [isCallForwardingOn, setIsCallForwardingOn] = useState(true);
  const [isAutoSchedulerEnabled, setIsAutoSchedulerEnabled] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <DemoSidebar />
      <DemoWalkthrough />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

        {/* Top bar — desktop only */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0 z-10">
          <div>
            <h1 className="font-display text-xl font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your account, automations, and billing.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="h-9 px-4 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
            >
              Back to site
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto z-10 relative pt-14 lg:pt-0 pb-24 lg:pb-16 space-y-5">
          <DemoBanner />

          <div className="px-6 lg:px-10">
            <div className="max-w-4xl mx-auto space-y-10">

              {/* ── PROFILE CARD ── */}
              <motion.section
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-strong rounded-[2rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-white/10 shadow-xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)" }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0 border-2 border-white/10">
                  <span className="text-3xl font-display font-bold text-white">
                    {DEMO_USER.full_name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-display font-bold text-foreground">{DEMO_USER.full_name}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <p className="text-sm font-medium text-muted-foreground">{DEMO_USER.email}</p>
                  </div>
                  <p className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full inline-flex mt-3 border border-indigo-500/20">
                    {DEMO_USER.business_name}
                  </p>
                </div>

                <div className="mt-4 sm:mt-0">
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </motion.section>

              {/* ── AUTOMATION TOGGLES ── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Automation</h3>
                <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-lg divide-y divide-white/5">

                  <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Auto-Replies</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Send text messages to missed calls automatically</p>
                      </div>
                    </div>
                    <Switch
                      checked={isTextAutoOn}
                      onCheckedChange={setIsTextAutoOn}
                    />
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                        <Split className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Call Forwarding</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Route incoming calls to your team</p>
                      </div>
                    </div>
                    <Switch
                      checked={isCallForwardingOn}
                      onCheckedChange={setIsCallForwardingOn}
                    />
                  </div>

                  <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-rose-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-foreground">Auto Scheduler</p>
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-[10px] font-black tracking-widest text-rose-400 border border-rose-500/30">BETA</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">Tries to schedule clients automatically</p>
                      </div>
                    </div>
                    <Switch
                      checked={isAutoSchedulerEnabled}
                      onCheckedChange={setIsAutoSchedulerEnabled}
                    />
                  </div>

                </div>
              </motion.section>

              {/* ── GENERAL SETTINGS ── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">General</h3>
                <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-lg divide-y divide-white/5">

                  <button
                    onClick={() => navigate("/sign-up")}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Star className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Subscription Plan</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Manage your current billing cycle</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => navigate("/sign-up")}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sliders className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Configure Automation</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Edit reply logic and message templates</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => navigate("/sign-up")}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Tags className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Information & Pricing</p>
                        <p className="text-sm text-muted-foreground mt-0.5">Update logic rules for business services</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </button>

                </div>
              </motion.section>

              {/* ── SUPPORT & SIGN UP ── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-6"
              >
                <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-lg">
                  <button
                    onClick={() => navigate("/sign-up")}
                    className="w-full p-5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <HelpCircle className="w-6 h-6 text-foreground" />
                      </div>
                      <p className="text-base font-semibold text-foreground">Help & Support</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

                <button
                  onClick={() => navigate("/sign-up")}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold tracking-wide transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Sign Up to Access Your Account
                </button>
              </motion.section>

              <div className="h-10" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
