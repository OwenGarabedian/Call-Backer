import { motion } from "framer-motion";
import {
  PhoneMissed, MessageSquare, Database, LayoutList,
  LayoutGrid, Bell, BarChart3, Zap, User, CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { DEMO_USER, DEMO_CALLS, DEMO_MESSAGES, DEMO_STATS } from "@/lib/demoData";

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

const CALLER_NAMES: Record<string, string> = {
  "8055550192": "Jordan Marsh",
  "8055550348": "Taylor Nguyen",
  "8055550471": "Morgan Singh",
  "8055550623": "Casey Lee",
  "8055551067": "Riley Okonkwo",
};

export default function DemoDashboard() {
  const navigate = useNavigate();

  const statCards = [
    {
      title: "Missed Calls",
      value: DEMO_STATS.totalCalls,
      sub: "Total captured",
      icon: PhoneMissed,
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #ef4444 40%, #dc2626 100%)",
      href: "/demo/calls",
    },
    {
      title: "Messages Sent",
      value: DEMO_STATS.totalMessages,
      sub: "Auto-reply total",
      icon: MessageSquare,
      gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 40%, #1d4ed8 100%)",
      href: "/demo/messages",
    },
    {
      title: "Reply Rate",
      value: `${DEMO_STATS.engagedPercent}%`,
      sub: "Engaged leads",
      icon: BarChart3,
      gradient: "linear-gradient(135deg, #c084fc 0%, #a855f7 40%, #7c3aed 100%)",
      href: "/demo/messages",
    },
    {
      title: "Leads Contacted",
      value: DEMO_STATS.totalCustomers,
      sub: "Unique potential clients",
      icon: Zap,
      gradient: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 40%, #d97706 100%)",
      href: "/demo/database",
    },
  ];

  // Unique messages per caller (latest first)
  const uniqueMessages = Object.values(
    DEMO_MESSAGES.reduce((acc, msg) => {
      const key = msg.caller_id;
      if (!acc[key]) acc[key] = msg;
      return acc;
    }, {} as Record<string, typeof DEMO_MESSAGES[0]>)
  ).slice(0, 4);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <DemoSidebar />
      <DemoWalkthrough forceOpen />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold">
              Welcome, {DEMO_USER.full_name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{DEMO_USER.business_name}</p>
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
        <main className="flex-1 overflow-y-auto space-y-5 pb-8">
          <DemoBanner />

          {/* KPI cards */}
          <div className="px-6">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {statCards.map(({ title, value, sub, icon: Icon, gradient, href }, i) => (
                <motion.button
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  onClick={() => navigate(href)}
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
          </div>

          {/* Recent Activity + Messages */}
          <div className="px-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-display text-sm font-bold">Recent Activity</h2>
                  <button
                    onClick={() => navigate("/demo/calls")}
                    className="text-xs text-indigo-500 font-semibold hover:text-indigo-600 transition-colors"
                  >
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-3 px-5 py-2 border-b border-border bg-black/[0.02]">
                  <span className="text-[11px] font-semibold text-muted-foreground">Caller ID</span>
                  <span className="text-[11px] font-semibold text-muted-foreground">Action Taken</span>
                  <span className="text-[11px] font-semibold text-muted-foreground text-right">Time ago</span>
                </div>
                <div className="divide-y divide-border">
                  {DEMO_CALLS.slice(0, 6).map((call, i) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="grid grid-cols-3 items-center px-5 py-3.5 hover:bg-black/[0.02] transition-colors"
                    >
                      <span className="text-xs font-semibold text-foreground">{formatPhone(call.phone_number_calling)}</span>
                      <span className="text-xs text-muted-foreground capitalize">{call.action}</span>
                      <span className="text-xs text-muted-foreground text-right">{timeAgo(call.time)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Messages */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.4 }}
                className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-display text-sm font-bold">Recent Messages</h2>
                  <button
                    onClick={() => navigate("/demo/messages")}
                    className="text-xs text-indigo-500 font-semibold hover:text-indigo-600 transition-colors"
                  >
                    View all
                  </button>
                </div>
                <div className="grid grid-cols-[1fr_auto] px-5 py-2 border-b border-border bg-black/[0.02] gap-4">
                  <span className="text-[11px] font-semibold text-muted-foreground">Sender & Message</span>
                  <span className="text-[11px] font-semibold text-muted-foreground text-right">Time</span>
                </div>
                <div className="divide-y divide-border">
                  {uniqueMessages.map((msg) => {
                    const norm = msg.caller_id.replace(/\D/g, "").slice(-10);
                    const displayName = CALLER_NAMES[norm] || formatPhone(msg.caller_id);
                    return (
                      <div key={msg.id} className="grid grid-cols-[1fr_auto] items-center px-5 py-3 hover:bg-black/[0.02] transition-colors gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                            <p className="text-[11px] text-muted-foreground truncate opacity-80">{msg.text}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap text-right">{timeAgo(msg.created_at)}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <h2 className="font-display text-sm font-bold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "View Database", desc: "Browse all captured contacts and leads", icon: Database, color: "text-indigo-500", bg: "bg-indigo-500/10", href: "/demo/database" },
                  { label: "Control Center", desc: "Configure auto-reply messages and rules", icon: LayoutList, color: "text-amber-500", bg: "bg-amber-500/10", href: "/demo/control-center" },
                  { label: "Billing & Plan", desc: "Manage your subscription and billing", icon: LayoutGrid, color: "text-purple-500", bg: "bg-purple-500/10", href: "/demo/billing" },
                ].map(({ label, desc, icon: Icon, color, bg, href }) => (
                  <button
                    key={href}
                    onClick={() => navigate(href)}
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
          </div>
        </main>
      </div>
    </div>
  );
}
