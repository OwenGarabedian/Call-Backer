import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Settings as SettingsIcon,
  LayoutGrid,
  Layers,
  Phone,
  LogOut,
  User,
  Bell,
  MessageCircle,
  Split,
  CalendarDays,
  Star,
  Sliders,
  Tags,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  business_name?: string;
}

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: SettingsIcon, label: "Settings", to: "/settings" },
];

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Settings Toggles
  const [isTextAutoOn, setIsTextAutoOn] = useState(true);
  const [isCallForwardingOn, setIsCallForwardingOn] = useState(true);
  const [isAutoSchedulerEnabled, setIsAutoSchedulerEnabled] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      await fetchProfile();
      await fetchSettings();
      setLoading(false);
    })();
  }, [userId]);

  async function fetchProfile() {
    if (!userId) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  }

  async function fetchSettings() {
    if (!userId) return;
    const { data } = await supabase
      .from("user_settings")
      .select("text_back_enabled, call_routing_enabled, auto_scheduler_enabled")
      .eq("user_id", userId)
      .single();
    if (data) {
      setIsTextAutoOn(data.text_back_enabled);
      setIsCallForwardingOn(data.call_routing_enabled);
      setIsAutoSchedulerEnabled(data.auto_scheduler_enabled);
    }
  }

  const handleToggle = async (field: string, value: boolean) => {
    if (field === "text_back_enabled") setIsTextAutoOn(value);
    if (field === "call_routing_enabled") setIsCallForwardingOn(value);
    if (field === "auto_scheduler_enabled") setIsAutoSchedulerEnabled(value);

    if (userId) {
      await supabase
        .from("user_settings")
        .update({ [field]: value })
        .eq("user_id", userId);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const go = (path: string) => navigate(path, { state: { id: userId } });

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      {/* ── SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white">Call Backer</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => (
            <button
              key={to}
              onClick={() => go(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                location.pathname === to
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{profile?.full_name ?? "—"}</p>
              <p className="text-xs text-white/50 truncate">{profile?.email ?? "—"}</p>
            </div>
            <LogOut onClick={handleLogout} className="w-4 h-4 text-white/30 flex-shrink-0 hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Background Wave / Gradient Elements */}
        <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0 z-10">
          <div>
            <h1 className="font-display text-xl font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your account, automations, and billing.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 z-10 relative">
          
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
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {profile?.full_name || "User Name"}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {profile?.email || "user@callbacker.com"}
                  </p>
                </div>
                {profile?.business_name && (
                  <p className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full inline-flex mt-3 border border-indigo-500/20">
                    {profile.business_name}
                  </p>
                )}
              </div>
              
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => go("/profileSettings")}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </motion.section>

            {/* ── AUTOMATION SETTINGS ── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Automation</h3>
              <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-lg divide-y divide-white/5">
                
                {/* Auto-Replies */}
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
                    onCheckedChange={(val) => handleToggle("text_back_enabled", val)}
                  />
                </div>

                {/* Call Forwarding */}
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
                    onCheckedChange={(val) => handleToggle("call_routing_enabled", val)}
                  />
                </div>

                {/* Auto Scheduler */}
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
                    onCheckedChange={(val) => handleToggle("auto_scheduler_enabled", val)}
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
                  onClick={() => go("/payment")}
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
                  onClick={() => go("/control-center")}
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
                  onClick={() => go("/businessKnowledge")}
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

            {/* ── SUPPORT & ACTIONS ── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="space-y-6"
            >
              <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden shadow-lg">
                <button
                  onClick={() => go("/supportPage")}
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
                onClick={handleLogout}
                className="w-full h-14 rounded-2xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 text-red-500 font-semibold tracking-wide transition-all flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                LOG OUT
              </button>
            </motion.section>

            <div className="h-10" /> {/* Bottom padding */}
          </div>
        </main>
      </div>
    </div>
  );
}
