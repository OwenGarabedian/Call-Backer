import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", to: "/dashboard" },
  { icon: PhoneMissed, label: "Missed Calls", to: "/calls" },
  { icon: MessageSquare, label: "Messages", to: "/messages" },
  { icon: Database, label: "Database", to: "/database" },
  { icon: LayoutList, label: "Control Center", to: "/control-center" },
  { icon: Layers, label: "Billing", to: "/payment" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export function Sidebar({ activeUserId }: { activeUserId?: string | null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      let currentUserId = activeUserId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          currentUserId = user.id;
        } else {
          return;
        }
      }

      if (currentUserId) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", currentUserId)
          .single();
          
        if (isMounted && data) {
          setProfile(data);
        }
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [activeUserId]);

  const go = (path: string) => navigate(path, { state: { id: activeUserId } });

  const handleLogout = async () => {
    // Logout WITHOUT an alert dialog as specifically requested by the user
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-60 h-full border-r border-white/10 flex-shrink-0 z-50 shadow-xl"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)" }}
    >
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
          <Phone className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-white">Call Backer</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV.map(({ icon: Icon, label, to }) => {
          // Highlight standard dashboard/settings route exactly matching
          const isActive = location.pathname === to || (to === "/settings" && location.pathname.toLowerCase().includes("setting") && to !== location.pathname && location.pathname !== "/profileSettings");
          
          return (
            <button
              key={to}
              onClick={() => go(to)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                isActive || location.pathname === to
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/8"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer" onClick={handleLogout}>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">{profile?.full_name || "—"}</p>
            <p className="text-xs text-white/50 truncate">{profile?.email || "—"}</p>
          </div>
          <LogOut className="w-4 h-4 text-white/30 flex-shrink-0 hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
