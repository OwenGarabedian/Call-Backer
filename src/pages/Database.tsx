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
  Bell,
  User,
  Search,
  MapPin,
  Calendar,
  Zap,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";
import { Sidebar } from "../components/Sidebar";

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

  const filterLabel = filterType === "leads" ? "Leads" : filterType === "booked" ? "Booked" : "All Contacts";

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      
      {/* ── SIDEBAR ── */}
      <Sidebar activeUserId={routeUserId} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold">CRM Database</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage and filter your captured leads.</p>
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

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">TOTAL CONTACTS</div>
                <div className="text-3xl font-black font-display text-foreground leading-none">{stats.totalCustomers}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="glass-strong rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">ENGAGED RATE</div>
                <div className="text-3xl font-black font-display text-foreground leading-none">{stats.engagedPercent}%</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="glass-strong rounded-2xl border border-border p-5 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">BOOKED</div>
                <div className="text-3xl font-black font-display text-foreground leading-none">{stats.appointments}</div>
              </div>
            </motion.div>
          </div>

          {/* ── TABLE CONTAINER ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl border border-border overflow-hidden shadow-sm"
          >
            {/* Table header row with search + filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border bg-foreground/[0.01] gap-3">
              <h2 className="font-display text-sm font-bold">Contact Database</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-background/50 border border-border text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-48"
                  />
                </div>
                {/* Filter tabs */}
                <div className="flex items-center bg-background/50 border border-border rounded-xl p-1">
                  {(["all", "leads", "booked"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize",
                        filterType === f ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f === "all" ? "All" : f === "leads" ? "Leads" : "Booked"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] px-6 py-3 border-b border-border bg-black/[0.02] gap-4">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Contact</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Need</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-2">Status</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">Loading contacts…</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <Filter className="w-8 h-8 opacity-20" />
                <p className="text-sm">No profiles found.</p>
                <p className="text-xs opacity-70">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {filteredProfiles.map((p, idx) => {
                    const safeNameStr = p.name ? String(p.name) : "";
                    const hasName = safeNameStr.trim() !== "" && safeNameStr.toLowerCase() !== "null";

                    const safeApptStr = p.appointment ? String(p.appointment) : "";
                    const hasAppointment = safeApptStr.trim() !== "" && safeApptStr.toLowerCase() !== "null";

                    const isEngaged = p.isActiveLead;

                    const hasNeed = p.need && String(p.need) !== "null" && String(p.need).trim() !== "";
                    const hasLoc  = p.location && String(p.location) !== "null" && String(p.location).trim() !== "";

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, delay: idx > 20 ? 0 : idx * 0.02 }}
                        key={p.id}
                        onClick={() => navigate(`/text-profile?caller_id=${encodeURIComponent(p.caller_id)}`, { state: { id: routeUserId } })}
                        className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center px-6 py-4 hover:bg-black/[0.02] transition-colors cursor-pointer gap-4"
                      >
                        {/* Contact cell */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Phone className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {hasName ? safeNameStr : formatPhone(p.caller_id)}
                            </p>
                            {hasName && (
                              <p className="text-xs text-muted-foreground">{formatPhone(p.caller_id)}</p>
                            )}
                          </div>
                        </div>

                        {/* Need cell */}
                        <div className="flex items-center">
                          {hasNeed ? (
                            <span className="text-sm text-muted-foreground">{String(p.need)}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>

                        {/* Location cell */}
                        <div className="flex items-center gap-1.5">
                          {hasLoc ? (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs font-semibold text-muted-foreground uppercase truncate">{String(p.location)}</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground/50 italic">—</span>
                          )}
                        </div>

                        {/* Status cell */}
                        <div className="flex items-center justify-end">
                          {hasAppointment ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold tracking-wide">BOOKED</span>
                            </div>
                          ) : isEngaged ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] font-bold tracking-wide">ENGAGED</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-lg">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span className="text-[11px] font-bold tracking-wide">LEAD</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

        </main>
      </div>
    </div>
  );
}