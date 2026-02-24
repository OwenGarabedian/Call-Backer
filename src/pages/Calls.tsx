import { useEffect, useState, useCallback } from "react";
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
  AlertCircle,
  User,
  Zap,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Sidebar } from "../components/Sidebar";

// Types matching the app
interface LogItem {
  id: string | number;
  from?: string;
  phone_number_calling?: string;
  time?: string;
  route_to?: string;
  action?: string;
  success?: string | boolean;
  created_at?: string;
  user_id: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  business_name?: string;
  phone_number?: string;
}

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
  const d = ("" + num).replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function formatTime(item: LogItem) {
  const timeString = item.created_at || item.time;
  if (!timeString) return "Unknown";
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} • ${timePart}`;
}

export default function Calls() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [callLog, setCallLog] = useState<LogItem[]>([]);
  const [callerNames, setCallerNames] = useState<Record<string, string>>({});

  const go = (path: string) => navigate(path, { state: { id: userId } });

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (profileData) setProfile(profileData);

      const [logRes, profilesRes] = await Promise.all([
        supabase
          .from("call_log")
          .select("*")
          .eq("user_id", userId)
          .order("time", { ascending: false }),
        supabase.from("text_profiles").select("caller_id, name").eq("user_id", userId),
      ]);

      if (logRes.data) setCallLog(logRes.data);

      const fetchedProfiles = profilesRes.data ?? [];
      const namesMap: Record<string, string> = {};
      fetchedProfiles.forEach((p) => {
        const d = (p.caller_id ?? "").replace(/\D/g, "");
        const norm = d.length >= 10 ? d.slice(-10) : d;
        if (norm && p.name) namesMap[norm] = p.name;
      });
      setCallerNames(namesMap);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();

    // Listen for real-time insert/updates just like the app
    if (!userId) return;
    const callLogSub = supabase
      .channel(`caller-log-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "call_log", filter: `user_id=eq.${userId}` },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callLogSub);
    };
  }, [userId, fetchData]);

  const totalCalls = callLog.length;
  const textedCount = callLog.filter(
    (item) => item.action === "texted" || item.action === "Texted" || item.action === "sent"
  ).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">

      {/* ── SIDEBAR ── */}
      <Sidebar activeUserId={userId} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold">
              {loading ? "Dashboard" : `Missed Calls`}
            </h1>
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
          
          {/* Top Cards matching RN app style conceptually but web professional UI */}
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
                <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">MISSED CALLS</div>
                <div className="text-3xl font-black font-display text-foreground leading-none">{textedCount}</div>
              </div>
            </motion.div>
          </div>

          {/* Table Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
          >
            <div className="px-6 py-4 border-b border-border bg-foreground/[0.01]">
              <h2 className="font-display text-sm font-bold">Recent Logs</h2>
            </div>
            
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] px-6 py-3 border-b border-border bg-black/[0.02] gap-4">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Caller</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Action</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-5">Time</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">Loading call history…</div>
            ) : callLog.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                 <LayoutList className="w-8 h-8 opacity-20" />
                 <p className="text-sm">No caller logs recorded yet.</p>
               </div>
            ) : (
              <div className="divide-y divide-border">
                {callLog.map((item, i) => {
                  const numStr = item.phone_number_calling || item.from;
                  const d = (numStr || "").replace(/\D/g, "");
                  const norm = d.length >= 10 ? d.slice(-10) : d;
                  const displayName = callerNames[norm] || formatPhone(numStr);
                  
                  const isSuccess = String(item.success).toLowerCase() === "true";
                  
                  return (
                    <div key={item.id} className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] items-center px-6 py-4 hover:bg-black/[0.02] transition-colors gap-4">
                      
                      {/* Caller Info */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 hover:bg-indigo-500/20 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm">
                          <Phone className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                          {callerNames[norm] && (
                            <p className="text-xs text-muted-foreground">{formatPhone(numStr)}</p>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center">
                        <span className={cn("inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider", (item.action || "Unknown").toLowerCase() === "unknown" ? "bg-red-500/10 text-red-600" : (item.action || "").toLowerCase() === "answered" ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600")}>
                          {item.action || "Unknown"}
                        </span>
                      </div>

                      {/* Status Badge matches RN Success/Fail */}
                      <div className="flex items-center">
                         {isSuccess ? (
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

                      {/* Time */}
                      <div className="flex items-center justify-end text-right min-w-0">
                        <span className="text-xs text-muted-foreground font-medium">{formatTime(item)}</span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
          
        </main>
      </div>
    </div>
  );
}
