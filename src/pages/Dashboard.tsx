import { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  Settings,
  LayoutGrid,
  Layers,
  Phone,
  TrendingUp,
  ArrowRight,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
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

/* ─── Tiny bar-chart component ───────────────────────── */
function SparkBars({ count, color }: { count: number; color: string }) {
  const max = 7;
  const bars = Array.from({ length: max }, (_, i) => {
    const h = i < count % max + 1 ? 60 + Math.random() * 40 : 15 + Math.random() * 25;
    return h;
  });
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%`, backgroundColor: color, opacity: i < (count % max) + 1 ? 1 : 0.2 }}
          className="w-1.5 rounded-sm transition-all duration-300"
        />
      ))}
    </div>
  );
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

  useEffect(() => {
    if (!userId) return;
    (async () => {
      await Promise.all([fetchProfile(), fetchCalls(), fetchMessages()]);
      setLoading(false);
    })();
  }, [userId]);

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

  const repliedCount = messages.filter((m) => m.status === "sent" || m.status === "delivered").length;
  const replyRate = messages.length > 0 ? Math.round((repliedCount / messages.length) * 100) : 0;

  const statCards = [
    {
      title: "Missed Calls",
      value: loading ? "—" : calls.length,
      sub: "Total captured",
      icon: PhoneMissed,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      href: "/calls",
    },
    {
      title: "Messages Sent",
      value: loading ? "—" : messages.length,
      sub: "Auto-reply total",
      icon: MessageSquare,
      color: "#22c55e",
      bg: "rgba(34,197,94,0.08)",
      href: "/messages",
    },
    {
      title: "Reply Rate",
      value: loading ? "—" : `${replyRate}%`,
      sub: "Delivered / total",
      icon: TrendingUp,
      color: "#6366f1",
      bg: "rgba(99,102,241,0.08)",
      href: "/messages",
    },
    {
      title: "Leads Captured",
      value: loading ? "—" : calls.length,
      sub: "Potential clients",
      icon: Zap,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      href: "/database",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">

      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-60 h-full border-r border-border glass-strong flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          </div>
          <span className="font-display text-sm font-bold tracking-tight">Call Backer</span>
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
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{profile?.full_name ?? "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email ?? "—"}</p>
            </div>
            <LogOut className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-50" />
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
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── KPI STAT CARDS ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map(({ title, value, sub, icon: Icon, color, bg, href }, i) => (
              <motion.button
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -2 }}
                onClick={() => go(href)}
                className="glass-strong rounded-2xl p-5 text-left border border-border hover:border-foreground/15 transition-all shadow-sm group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-2xl font-black font-display tabular-nums mb-0.5">{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{title}</div>
                <div className="mt-3">
                  <SparkBars count={typeof value === "number" ? value : 4} color={color} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* ── BOTTOM GRID ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Recent Missed Calls — 2/3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="xl:col-span-2 glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <PhoneMissed className="w-4 h-4 text-red-500" />
                  <h2 className="font-display text-sm font-bold">Recent Missed Calls</h2>
                </div>
                <button
                  onClick={() => go("/calls")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Loading…</div>
              ) : calls.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-8 h-8 opacity-30" />
                  <p className="text-sm">No missed calls yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {calls.slice(0, 7).map((call, i) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary/3 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <PhoneMissed className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{formatPhone(call.phone_number_calling)}</p>
                        <p className="text-xs text-muted-foreground">
                          {call.action ?? "missed"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{timeAgo(call.time)}</span>
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">
                          Missed
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Recent Messages */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <h2 className="font-display text-sm font-bold">Recent Messages</h2>
                  </div>
                  <button
                    onClick={() => go("/messages")}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Loading…</div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
                    <MessageSquare className="w-7 h-7 opacity-25" />
                    <p className="text-xs">No messages yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {messages.slice(0, 4).map((msg, i) => (
                      <div key={msg.id} className="flex items-start gap-3 px-5 py-3 hover:bg-primary/3 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">{formatPhone(msg.caller_id)}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.text ?? "Auto-reply sent"}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={cn(
                              "inline-block w-1.5 h-1.5 rounded-full",
                              msg.status === "delivered" ? "bg-green-500" : msg.status === "sent" ? "bg-blue-500" : "bg-yellow-500"
                            )} />
                            <span className="text-[10px] text-muted-foreground capitalize">{msg.status ?? "pending"}</span>
                            <span className="text-[10px] text-muted-foreground">· {timeAgo(msg.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="glass-strong rounded-2xl border border-border p-5 shadow-sm"
              >
                <h2 className="font-display text-sm font-bold mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: "View Database", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/database" },
                    { label: "Control Center", icon: LayoutList, color: "text-amber-500", bg: "bg-amber-500/10", href: "/control-center" },
                    { label: "Billing & Plan", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10", href: "/payment" },
                  ].map(({ label, icon: Icon, color, bg, href }) => (
                    <button
                      key={href}
                      onClick={() => go(href)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 transition-colors group text-left"
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", bg)}>
                        <Icon className={cn("w-4 h-4", color)} />
                      </div>
                      <span className="text-sm font-medium flex-1">{label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}