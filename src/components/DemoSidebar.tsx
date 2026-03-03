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
  { icon: LayoutGrid,    label: "Dashboard",      to: "/demo" },
  { icon: PhoneMissed,   label: "Missed Calls",    to: "/demo/calls" },
  { icon: MessageSquare, label: "Messages",        to: "/demo/messages" },
  { icon: Database,      label: "Database",        to: "/demo/database" },
  { icon: LayoutList,    label: "Control Center",  to: "/demo/control-center" },
  { icon: Layers,        label: "Billing",         to: "/demo/billing" },
  { icon: Settings,      label: "Settings",        to: "/demo/settings" },
];

export function DemoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
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
        {NAV.map(({ icon: Icon, label, to }) => {
          const isActive =
            to === "/demo"
              ? location.pathname === "/demo"
              : location.pathname.startsWith(to);

          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: fake user + sign-up CTA */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {DEMO_USER.full_name.charAt(0)}
            </span>
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
  );
}
