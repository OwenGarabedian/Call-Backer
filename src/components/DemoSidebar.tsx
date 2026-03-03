import { useLocation, useNavigate } from "react-router-dom";
import {
  PhoneMissed,
  MessageSquare,
  Database,
  LayoutList,
  LayoutGrid,
  Layers,
  Phone,
  UserPlus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_USER } from "@/lib/demoData";

const NAV = [
  { icon: LayoutGrid,    label: "Dashboard",     to: "/demo" },
  { icon: PhoneMissed,   label: "Calls",          to: "/demo/calls" },
  { icon: MessageSquare, label: "Messages",       to: "/demo/messages" },
  { icon: Database,      label: "Database",       to: "/demo/database" },
  { icon: LayoutList,    label: "Control Center", to: "/demo/control-center" },
  { icon: Layers,        label: "Billing",        to: "/demo/billing" },
  { icon: Settings,      label: "Settings",       to: "/demo/settings" },
];

export function DemoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string) =>
    to === "/demo" ? location.pathname === "/demo" : location.pathname.startsWith(to);

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside
        className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0 z-50 shadow-xl"
        style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-display text-sm font-bold tracking-tight text-white">Call Backer</span>
            <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-none mt-0.5">Demo Mode</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ icon: Icon, label, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                isActive(to)
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom: fake user + sign-up CTA */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{DEMO_USER.full_name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{DEMO_USER.full_name}</p>
              <p className="text-xs text-white/50 truncate">{DEMO_USER.email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/sign-up")}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up Free
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR (below lg) ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/10 shadow-lg"
        style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <Phone className="w-3 h-3 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-display text-sm font-bold text-white">Call Backer</span>
            <span className="ml-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Demo</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/sign-up")}
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors"
        >
          <UserPlus className="w-3 h-3" />
          Sign Up
        </button>
      </div>

      {/* ── MOBILE BOTTOM NAV (below lg) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t border-white/10"
        style={{ background: "linear-gradient(0deg, #0f172a 0%, #1e1b4b 100%)" }}
      >
        {NAV.slice(0, 5).map(({ icon: Icon, label, to }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all flex-1",
              isActive(to) ? "text-white" : "text-white/35 hover:text-white/70"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
              isActive(to) ? "bg-white/15" : ""
            )}>
              <Icon className="w-4.5 h-4.5 w-4 h-4" />
            </div>
            <span className="text-[9px] font-bold tracking-wide leading-none">{label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
