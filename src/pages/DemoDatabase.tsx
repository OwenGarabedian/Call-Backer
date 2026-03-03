import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Bell, Search, MapPin, Calendar,
  Zap, Filter, CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DemoSidebar } from "@/components/DemoSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { DemoWalkthrough } from "@/components/DemoWalkthrough";
import { DEMO_PROFILES, DEMO_STATS } from "@/lib/demoData";

function formatPhone(num?: string | null) {
  if (!num) return "Unknown";
  const d = (num + "").replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return num;
}

export default function DemoDatabase() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "leads" | "booked">("all");

  const filteredProfiles = DEMO_PROFILES.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (p.caller_id || "").toLowerCase().includes(q) ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.need || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const hasAppointment = !!p.appointment && p.appointment.trim() !== "" && p.appointment.toLowerCase() !== "null";

    if (filterType === "leads") return !hasAppointment;
    if (filterType === "booked") return hasAppointment;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <DemoSidebar />
      <DemoWalkthrough />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — desktop only */}
        <header className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-border glass-strong flex-shrink-0">
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
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-24 lg:pb-8 space-y-5">
          <DemoBanner />

          <div className="px-3 sm:px-6 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl border border-border p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">CONTACTS</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground leading-none">{DEMO_STATS.totalCustomers}</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 }}
                className="glass-strong rounded-2xl border border-border p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">ENGAGED</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground leading-none">{DEMO_STATS.engagedPercent}%</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="glass-strong rounded-2xl border border-border p-4 sm:p-5 shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground tracking-wider mb-0.5">BOOKED</div>
                  <div className="text-2xl sm:text-3xl font-black font-display text-foreground leading-none">{DEMO_STATS.appointments}</div>
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
              {/* Table header with search + filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-foreground/[0.01] gap-3">
                <h2 className="font-display text-sm font-bold">Contact Database</h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-background/50 border border-border text-sm rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-40"
                    />
                  </div>
                  <div className="flex items-center bg-background/50 border border-border rounded-xl p-1 flex-shrink-0">
                    {(["all", "leads", "booked"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterType(f)}
                        className={cn(
                          "px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-all capitalize",
                          filterType === f
                            ? "bg-foreground text-background shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {f === "all" ? "All" : f === "leads" ? "Leads" : "Booked"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scrollable table */}
              <div className="overflow-x-auto">
                <div className="min-w-[480px]">
                  <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] px-6 py-3 border-b border-border bg-black/[0.02] gap-4">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Contact</span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Need</span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right pr-2">Status</span>
                  </div>

                  {filteredProfiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                      <Filter className="w-8 h-8 opacity-20" />
                      <p className="text-sm">No profiles found.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      <AnimatePresence>
                        {filteredProfiles.map((p, idx) => {
                          const hasAppointment = !!p.appointment && p.appointment.trim() !== "" && p.appointment.toLowerCase() !== "null";
                          return (
                            <motion.div
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2, delay: idx * 0.03 }}
                              key={p.id}
                              className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center px-6 py-4 hover:bg-black/[0.02] transition-colors cursor-default gap-4"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                                  <Phone className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground truncate">{p.name || formatPhone(p.caller_id)}</p>
                                  {p.name && (
                                    <p className="text-xs text-muted-foreground">{formatPhone(p.caller_id)}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center">
                                {p.need ? (
                                  <span className="text-sm text-muted-foreground">{p.need}</span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">—</span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                {p.location ? (
                                  <>
                                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase truncate">{p.location}</span>
                                  </>
                                ) : (
                                  <span className="text-xs text-muted-foreground/50 italic">—</span>
                                )}
                              </div>

                              <div className="flex items-center justify-end">
                                {hasAppointment ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold tracking-wide">BOOKED</span>
                                  </div>
                                ) : p.isActiveLead ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold tracking-wide">ACTIVE</span>
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
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
