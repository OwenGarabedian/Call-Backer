import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Settings,
  LayoutGrid,
  Layers,
  Phone,
  LogOut,
  Bell,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  User,
  Zap,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────── */
interface Profile {
  id: string;
  full_name: string;
  email: string;
  business_name?: string;
}

interface CallLog {
  id: string;
  phone_number_calling?: string;
  time?: string;
  action?: string;
  success?: boolean;
}

interface Message {
  id: string;
  status?: string;
  created_at?: string;
  caller_id?: string;
  text?: string;
  direction?: string;
}

/* ─── Sidebar nav items ─────────────────────────────── */
const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

/* ─── Helpers ───────────────────────────────────────── */
function formatPhone(num?: string) {
  if (!num) return "Unknown";
  const d = num.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function timeAgo(ts?: string) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ─── Main Component ─────────────────────────────────── */
export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Updated Stats State
  const [stats, setStats] = useState({
    totalCalls: 0,
    totalMessages: 0,
    totalCustomers: 0,
    engagedPercent: 0,
  });

  useEffect(() => {
    if (!userId) return;
    (async () => {
      await Promise.all([fetchProfile(), fetchCalls(), fetchMessages(), fetchStats()]);
      setLoading(false);
    })();
  }, [userId]);

  async function fetchStats() {
    // Fetch relevant data simultaneously just like the app
    const [profilesRes, logsRes, messagesRes] = await Promise.all([
      supabase.from("text_profiles").select("caller_id").eq("user_id", userId),
      supabase.from("call_log").select("phone_number_calling, action").eq("user_id", userId),
      supabase.from("messages").select("caller_id, direction").eq("user_id", userId),
    ]);

    const fetchedProfiles = profilesRes.data || [];
    const logs = logsRes.data || [];
    const fetchedMsgs = messagesRes.data || [];

    // Normalizer to ensure matching phone number formats
    const normalizePhone = (phone?: string | null) => {
      if (!phone) return null;
      const digitsOnly = phone.replace(/\D/g, "");
      return digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
    };

    // Calculate Unique Customers
    const uniqueContactsMap = new Map<string, boolean>();

    fetchedProfiles.forEach((p) => {
      const normPhone = normalizePhone(p.caller_id);
      if (normPhone) uniqueContactsMap.set(normPhone, true);
    });

    logs.forEach((log) => {
      const normPhone = normalizePhone(log.phone_number_calling);
      if (normPhone) uniqueContactsMap.set(normPhone, true);
    });

    const totalCustomers = uniqueContactsMap.size;

    // Calculate Engaged/Replied Percent based on inbound messages
    const inboundMessages = fetchedMsgs.filter(
      (m) => m.direction && m.direction.includes("inbound")
    );
    
    const engagedCallers = new Set(
      inboundMessages.map((m) => normalizePhone(m.caller_id)).filter(Boolean)
    );

    const engagedPercent =
      totalCustomers > 0
        ? Math.round((engagedCallers.size / totalCustomers) * 100)
        : 0;

    setStats({
      totalCalls: logs.length,
      totalMessages: fetchedMsgs.length,
      totalCustomers: totalCustomers,
      engagedPercent: engagedPercent,
    });
  }

  async function fetchProfile() {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
  }
  
  async function fetchCalls() {
    const { data } = await supabase
      .from("call_log")
      .select("*")
      .eq("user_id", userId)
      .order("time", { ascending: false })
      .limit(20);
    if (data) setCalls(data);
  }
  
  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setMessages(data);
  }

  const go = (path: string) => navigate(path, { state: { id: userId } });

  const statCards = [
    {
      title: "Missed Calls",
      value: loading ? "—" : stats.totalCalls,
      sub: "Total captured",
      icon: PhoneMissed,
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #ef4444 40%, #dc2626 100%)",
      href: "/calls",
    },
    {
      title: "Messages Sent",
      value: loading ? "—" : stats.totalMessages,
      sub: "Auto-reply total",
      icon: MessageSquare,
      gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)",
      href: "/messages",
    },
    {
      title: "Reply Rate",
      value: loading ? "—" : `${stats.engagedPercent}%`,
      sub: "Engaged leads",
      icon: BarChart3,
      gradient: "linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #7c3aed 100%)",
      href: "/messages",
    },
    {
      title: "Leads Captured",
      value: loading ? "—" : stats.totalCustomers,
      sub: "Unique potential clients",
      icon: Zap,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
      href: "/database",
    },
  ];

  // Deduplicate messages — keep only the most recent per unique caller_id
  const uniqueMessages = Object.values(
    messages.reduce((acc, msg) => {
      const key = msg.caller_id ?? msg.id;
      if (!acc[key]) acc[key] = msg;
      return acc;
    }, {} as Record<string, typeof messages[0]>)
  ).slice(0, 4);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">

      {/* ── SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-white">Call Backer</span>
        </div>

        {/* Nav */}
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

        {/* User footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{profile?.full_name ?? "—"}</p>
              <p className="text-xs text-white/50 truncate">{profile?.email ?? "—"}</p>
            </div>
            <LogOut className="w-4 h-4 text-white/30 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold">
              {loading ? "Dashboard" : `Welcome, ${profile?.full_name ?? "there"}`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile?.business_name ?? "Here's what's happening with your calls today."}
            </p>
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
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ── KPI STAT CARDS ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map(({ title, value, sub, icon: Icon, gradient, href }, i) => (
              <motion.button
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => go(href)}
                className="rounded-2xl p-7 text-left shadow-md group overflow-hidden relative"
                style={{ background: gradient }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-4xl font-black font-display tabular-nums text-white leading-none">{value}</div>
                    <div className="text-sm font-semibold text-white/85 mt-1.5">{title}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-xs text-white/60 mt-3">{sub}</div>
              </motion.button>
            ))}
          </div>

          {/* ── MAIN PANELS ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Recent Activity (table style) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display text-sm font-bold">Recent Activity</h2>
                <button
                  onClick={() => go("/calls")}
                  className="text-xs text-indigo-500 font-semibold hover:text-indigo-600 transition-colors"
                >
                  View all
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-3 px-5 py-2 border-b border-border bg-black/[0.02]">
                <span className="text-[11px] font-semibold text-muted-foreground">Caller ID</span>
                <span className="text-[11px] font-semibold text-muted-foreground">Action Taken</span>
                <span className="text-[11px] font-semibold text-muted-foreground text-right">Time ago</span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">Loading…</div>
              ) : calls.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No activity yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {calls.slice(0, 6).map((call, i) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="grid grid-cols-3 items-center px-5 py-3.5 hover:bg-black/[0.02] transition-colors"
                    >
                      <span className="text-xs font-semibold text-foreground">{formatPhone(call.phone_number_calling)}</span>
                      <span className="text-xs text-muted-foreground capitalize">{call.action ?? "Texted"}</span>
                      <span className="text-xs text-muted-foreground text-right">{timeAgo(call.time)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recent Messages (deduplicated, table style) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display text-sm font-bold">Recent Messages</h2>
                <button
                  onClick={() => go("/messages")}
                  className="text-xs text-indigo-500 font-semibold hover:text-indigo-600 transition-colors"
                >
                  View all
                </button>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] px-5 py-2 border-b border-border bg-black/[0.02] gap-4">
                <span className="text-[11px] font-semibold text-muted-foreground">Message</span>
                <span className="text-[11px] font-semibold text-muted-foreground">Sender</span>
                <span className="text-[11px] font-semibold text-muted-foreground">Time</span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">Loading…</div>
              ) : uniqueMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                  <MessageSquare className="w-7 h-7 opacity-25" />
                  <p className="text-xs">No messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {uniqueMessages.map((msg, i) => {
                    const initials = (msg.caller_id ?? "?").replace(/\D/g, "").slice(-4, -2) || "?";
                    const avatarColors = ["bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500"];
                    return (
                      <div key={msg.id} className="grid grid-cols-[1fr_auto_auto] items-center px-5 py-3 hover:bg-black/[0.02] transition-colors gap-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold", avatarColors[i % avatarColors.length])}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{msg.text ?? "Auto-reply sent"}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{formatPhone(msg.caller_id)}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{profile?.full_name ? profile.full_name.split(" ")[0] + " " + (profile.full_name.split(" ")[1]?.[0] ?? "") + "." : "—"}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(msg.created_at)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── QUICK ACTIONS (horizontal) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <h2 className="font-display text-sm font-bold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "View Database", desc: "Browse all captured contacts and leads", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/database" },
                { label: "Control Center", desc: "Configure auto-reply messages and rules", icon: LayoutList, color: "text-amber-500", bg: "bg-amber-500/10", href: "/control-center" },
                { label: "Billing & Plan", desc: "Manage your subscription and billing", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10", href: "/payment" },
              ].map(({ label, desc, icon: Icon, color, bg, href }) => (
                <button
                  key={href}
                  onClick={() => go(href)}
                  className="glass-strong flex items-center gap-4 px-5 py-4 rounded-2xl border border-border hover:border-foreground/15 transition-all shadow-sm text-left group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                    <Icon className={cn("w-5 h-5", color)} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

        </main>
      </div>
    </div>
  );
}