import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
  Bell,
  User,
  Search,
  MapPin,
  Calendar,
  Zap,
  Filter
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";

// --- Nav Definition ---
const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

// --- Types ---
interface UnifiedProfile {
  id: string;
  caller_id: string;
  name: string | null;
  need: string | null;
  location: string | null;
  appointment: string | null;
  updated_at: string;
  isActiveLead?: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  business_name?: string;
}

// --- Helpers ---
function formatPhone(num?: string | null) {
  if (!num) return "Unknown";
  const d = ("" + num).replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

function normalizePhone(phone: string | null) {
  if (!phone) return null;
  const digitsOnly = String(phone).replace(/\D/g, "");
  return digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
}

export default function DatabaseScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeUserId = (location.state as { id?: string })?.id;

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Data
  const [profiles, setProfiles] = useState<UnifiedProfile[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    missedPercent: 0,
    engagedPercent: 0,
    appointments: 0,
  });

  // Filters - FIXED: Now strictly uses All, Leads, or Booked
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "leads" | "booked">("all");

  const go = (path: string) => navigate(path, { state: { id: routeUserId } });

  const fetchData = useCallback(async (currentUserId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();
      if (profileData) setProfile(profileData);

      const [profilesRes, logsRes, messagesRes] = await Promise.all([
        supabase.from("text_profiles").select("*").eq("user_id", currentUserId),
        supabase.from("call_log").select("phone_number_calling, success, time, action").eq("user_id", currentUserId),
        supabase.from("messages").select("caller_id, direction").eq("user_id", currentUserId),
      ]);

      const fetchedProfiles = profilesRes.data || [];
      const logs = logsRes.data || [];
      const messages = messagesRes.data || [];

      const uniqueContactsMap = new Map<string, UnifiedProfile>();

      fetchedProfiles.forEach((p) => {
        const normPhone = normalizePhone(p.caller_id);
        if (normPhone) {
          const existing = uniqueContactsMap.get(normPhone);

          if (existing) {
            uniqueContactsMap.set(normPhone, {
              ...existing,
              name: existing.name || p.name,
              need: existing.need || p.need,
              appointment: existing.appointment || p.appointment,
              location: existing.location || p.location,
              updated_at:
                new Date(p.updated_at || 0) > new Date(existing.updated_at || 0)
                  ? p.updated_at
                  : existing.updated_at,
            });
          } else {
            uniqueContactsMap.set(normPhone, { ...p });
          }
        }
      });

      logs.forEach((log) => {
        const normPhone = normalizePhone(log.phone_number_calling);
        if (normPhone && !uniqueContactsMap.has(normPhone)) {
          uniqueContactsMap.set(normPhone, {
            id: String(log.phone_number_calling || normPhone),
            caller_id: String(log.phone_number_calling || normPhone),
            name: null,
            need: null,
            location: null,
            appointment: null,
            updated_at: log.time || new Date().toISOString(),
          });
        }
      });

      const totalCustomers = uniqueContactsMap.size;
      const totalCalls = logs.length;
      
      const missedCalls = logs.filter((log) => {
          const actionStr = String(log.action || "").toLowerCase();
          return actionStr === "texted" || actionStr === "sent";
      }).length;
      
      const missedPercent = totalCalls > 0 ? Math.round((missedCalls / totalCalls) * 100) : 0;

      const inboundMessages = messages.filter((m) => String(m.direction || "").toLowerCase().includes("inbound"));
      
      const engagedCallers = new Set(
        inboundMessages.map((m) => normalizePhone(m.caller_id)).filter(Boolean)
      );

      const engagedPercent = totalCustomers > 0 ? Math.round((engagedCallers.size / totalCustomers) * 100) : 0;

      const unifiedProfiles = Array.from(uniqueContactsMap.values())
        .map((p) => ({
          ...p,
          isActiveLead: engagedCallers.has(normalizePhone(p.caller_id)),
        }))
        .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime());

      const appointmentsCount = unifiedProfiles.filter((p) => {
          const apptStr = String(p.appointment || "");
          return apptStr.trim() !== "" && apptStr.toLowerCase() !== "null";
      }).length;

      setStats({
        totalCustomers,
        missedPercent,
        engagedPercent,
        appointments: appointmentsCount,
      });
      setProfiles(unifiedProfiles);
    } catch (error) {
      console.error("Error fetching CRM data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let crmSubscription: any = null;

    const initDataAndRealtime = async () => {
      let currentUserId = routeUserId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            currentUserId = user.id;
        } else {
            if (isMounted) setLoading(false);
            return; 
        }
      }

      if (!isMounted) return;
      
      await fetchData(currentUserId);

      crmSubscription = supabase
        .channel(`crm-${currentUserId}`) 
        .on("postgres_changes", { event: "*", schema: "public", table: "text_profiles", filter: `user_id=eq.${currentUserId}` }, () => fetchData(currentUserId!))
        .on("postgres_changes", { event: "*", schema: "public", table: "call_log", filter: `user_id=eq.${currentUserId}` }, () => fetchData(currentUserId!))
        .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `user_id=eq.${currentUserId}` }, () => fetchData(currentUserId!))
        .subscribe();
    };

    initDataAndRealtime();

    return () => {
      isMounted = false;
      if (crmSubscription) supabase.removeChannel(crmSubscription);
    };
  }, [routeUserId, fetchData]);

  // Derived filtered data
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    const safePhone = p.caller_id ? String(p.caller_id).toLowerCase() : "";
    const safeName = p.name ? String(p.name).toLowerCase() : "";
    const safeNeed = p.need ? String(p.need).toLowerCase() : "";
    
    const matchesSearch = !q || safePhone.includes(q) || safeName.includes(q) || safeNeed.includes(q);

    if (!matchesSearch) return false;

    const appointmentStr = p.appointment ? String(p.appointment) : "";
    const hasValidAppointment = appointmentStr.trim() !== "" && appointmentStr.toLowerCase() !== "null";

    // FIXED: Corrected tab filtering logic
    if (filterType === "leads") {
      // "Leads" are anyone who DOES NOT have an appointment booked yet
      return !hasValidAppointment; 
    }
    
    if (filterType === "booked") {
      // "Booked" are only those with an appointment
       return hasValidAppointment;
    }
    
    // "All" returns everyone
    return true; 
  });

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
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer" onClick={() => navigate("/")}>
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
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0 relative z-10">
          <div>
            <h1 className="font-display text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              {loading ? "CRM Database" : `CRM Database`}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage and filter your captured leads.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors relative">
              <Bell className="w-4 h-4" />
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
        <main className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          
          {/* ── TOP ACTION BAR & STATS ── */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              
              {/* Stats Pills */}
              <div className="flex flex-wrap items-center gap-3">
                  <div className="glass-strong border border-border px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-semibold text-muted-foreground">Total:</span>
                      <span className="text-sm font-bold text-foreground">{stats.totalCustomers}</span>
                  </div>
                  <div className="glass-strong border border-border px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <Zap className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-muted-foreground">Engaged Rate:</span>
                      <span className="text-sm font-bold text-foreground">{stats.engagedPercent}%</span>
                  </div>
                  <div className="glass-strong border border-border px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-muted-foreground">Appointments Booked:</span>
                      <span className="text-sm font-bold text-foreground">{stats.appointments}</span>
                  </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                          type="text" 
                          placeholder="Search names, phones, needs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-background/50 border border-border text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm hidden md:block"
                      />
                      {/* Responsive small search */}
                      <input 
                          type="text" 
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-background/50 border border-border text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm md:hidden"
                      />
                  </div>
                  
                  {/* FIXED: Tab Buttons */}
                  <div className="flex items-center bg-background/50 border border-border rounded-xl p-1 shadow-sm w-full sm:w-auto">
                      <button 
                          onClick={() => setFilterType("all")}
                          className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 sm:flex-none text-center", filterType === "all" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground")}
                      >
                          All
                      </button>
                      <button 
                          onClick={() => setFilterType("leads")}
                          className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 sm:flex-none text-center", filterType === "leads" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground")}
                      >
                          Leads
                      </button>
                      <button 
                          onClick={() => setFilterType("booked")}
                          className={cn("px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex-1 sm:flex-none text-center", filterType === "booked" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground")}
                      >
                          Booked
                      </button>
                  </div>
              </div>
          </div>

          {/* ── CARD GRID ── */}
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 gap-4">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                 <p className="text-sm text-muted-foreground font-medium">Loading CRM data...</p>
             </div>
          ) : filteredProfiles.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 gap-3 bg-secondary/30 rounded-3xl border border-dashed border-border/60">
                 <Filter className="w-10 h-10 text-muted-foreground/30" />
                 <p className="text-sm font-semibold text-foreground">No profiles found.</p>
                 <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
             </div>
          ) : (
            <motion.div 
               layout
               className="flex flex-col w-full max-w-5xl mx-auto divide-y divide-black/5 dark:divide-white/5 pb-20"
            >
               <AnimatePresence>
                 {filteredProfiles.map((p, idx) => {
                    const safeNameStr = p.name ? String(p.name) : "";
                    const hasName = safeNameStr.trim() !== "" && safeNameStr.toLowerCase() !== "null";
                    
                    const safeApptStr = p.appointment ? String(p.appointment) : "";
                    const hasAppointment = safeApptStr.trim() !== "" && safeApptStr.toLowerCase() !== "null";
                    
                    const isEngaged = p.isActiveLead;

                    return (
                        <motion.div
                           layout
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ duration: 0.3, delay: idx > 15 ? 0 : idx * 0.02 }}
                           key={p.id}
                           onClick={() => navigate(`/text-profile?caller_id=${encodeURIComponent(p.caller_id)}`, { state: { id: routeUserId } })}
                           className="group flex flex-col xl:flex-row xl:items-center justify-between py-4 sm:py-5 px-2 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer rounded-2xl sm:rounded-3xl"
                        >
                            {/* Left: Avatar & Text */}
                            <div className="flex items-center gap-4 sm:gap-5 min-w-0 mb-3 xl:mb-0 xl:w-1/3">
                                <div className={cn(
                                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display text-base sm:text-lg font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-105",
                                    hasName ? "bg-indigo-50/50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20" : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                )}>
                                    {hasName ? safeNameStr.charAt(0).toUpperCase() : "#"}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {hasName ? safeNameStr : "Unknown Caller"}
                                    </h3>
                                    <p className="text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 tracking-wide">
                                        {formatPhone(p.caller_id)}
                                    </p>
                                </div>
                            </div>

                            {/* Middle & Right: Details & Status */}
                            <div className="flex flex-row items-center justify-between xl:justify-end gap-4 sm:gap-8 xl:w-2/3 ml-[3.5rem] sm:ml-[4.25rem] xl:ml-0">
                                {/* Need & Location */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 min-w-0 flex-1">
                                    <div className="flex-1 min-w-0">
                                        {p.need && String(p.need) !== "null" && String(p.need).trim() !== "" ? (
                                            <p className="text-[14px] sm:text-[15px] text-gray-800 dark:text-gray-200 truncate font-medium transition-colors">Needs {String(p.need)}</p>
                                        ) : (
                                            <p className="text-[13px] sm:text-[14px] text-gray-400 dark:text-gray-500 italic">No notes</p>
                                        )}
                                    </div>

                                    {p.location && String(p.location) !== "null" && String(p.location).trim() !== "" && (
                                        <div className="flex items-center gap-1.5 w-24 sm:w-32 flex-shrink-0">
                                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                            <span className="text-[11px] sm:text-[12px] font-bold text-gray-500 truncate uppercase">{String(p.location)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* FIXED Status Indicators */}
                                <div className="flex items-center justify-end w-24 flex-shrink-0">
                                    {hasAppointment ? (
                                        <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" /> BOOKED
                                        </span>
                                    ) : isEngaged ? (
                                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" /> ENGAGED
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-500 text-[10px] font-bold tracking-widest uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> ACTIVE LEAD
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                 })}
               </AnimatePresence>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}