import { motion } from "framer-motion";
import {
  PhoneMissed, LayoutList, Bell, Phone,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { DEMO_CALLS } from "@/lib/demoData";

const CALLER_NAMES: Record<string, string> = {
  "8055550192": "Jordan Marsh",
  "8055550348": "Taylor Nguyen",
  "8055550471": "Morgan Singh",
  "8055550623": "Casey Lee",
  "8055551067": "Riley Okonkwo",
};

function formatPhone(num?: string) {
  if (!num) return "Unknown";
  const d = num.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function formatTime(ts?: string) {
  if (!ts) return "Unknown";
  const date = new Date(ts);
  const datePart = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} • ${timePart}`;
}

export default function DemoCalls() {
  const navigate = useNavigate();

  const totalCalls = DEMO_CALLS.length;
  const textedCount = DEMO_CALLS.filter(
    (c) => c.action.toLowerCase() === "texted" || c.action.toLowerCase() === "sent"
  ).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <DemoSidebar />
      <DemoWalkthrough />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — desktop only */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold">Missed Calls</h1>
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
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-24 lg:pb-8 space-y-5">
          <DemoBanner />

          <div className="px-6 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <LayoutList className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">TOTAL CALLS</div>
                  <div className="text-3xl font-black font-display text-foreground leading-none">{totalCalls}</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-strong rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <PhoneMissed className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">AUTO-TEXTED</div>
                  <div className="text-3xl font-black font-display text-foreground leading-none">{textedCount}</div>
                </div>
              </motion.div>
            </div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <div className="px-6 py-4 border-b border-border bg-foreground/[0.01]">
                <h2 className="font-display text-sm font-bold">Recent Logs</h2>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[560px]">

              <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] px-6 py-3 border-b border-border bg-black/[0.02] gap-4">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Caller</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Action</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-5">Time</span>
              </div>

              <div className="divide-y divide-border">
                {DEMO_CALLS.map((call, i) => {
                  const norm = call.phone_number_calling.replace(/\D/g, "").slice(-10);
                  const displayName = CALLER_NAMES[norm] || formatPhone(call.phone_number_calling);
                  return (
                    <div key={call.id} className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] items-center px-6 py-4 hover:bg-black/[0.02] transition-colors gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Phone className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                          {CALLER_NAMES[norm] && (
                            <p className="text-xs text-muted-foreground">{formatPhone(call.phone_number_calling)}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className={cn(
                          "inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider",
                          call.action.toLowerCase() === "answered"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-blue-500/10 text-blue-600"
                        )}>
                          {call.action}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {call.success ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold tracking-wide">SUCCESS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-600 rounded-lg">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold tracking-wide">FAILED</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end text-right min-w-0">
                        <span className="text-xs text-muted-foreground font-medium">{formatTime(call.time)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
