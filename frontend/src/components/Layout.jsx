import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Menu, X, Store } from "lucide-react";
import { usePos } from "@/context/PosContext";
import { toast } from "sonner";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, testId: "sidebar-nav-dashboard", end: true, roles: ["Admin", "Manager"] },
  { to: "/kasir", label: "Kasir", icon: ShoppingCart, testId: "sidebar-nav-kasir" },
  { to: "/setting", label: "Setting", icon: Settings, testId: "sidebar-nav-setting", roles: ["Admin", "Manager"] },
];

const LiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right" data-testid="header-clock">
      <p className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
        {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </p>
      <p className="text-xs text-slate-500">
        {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
};

const SidebarContent = ({ onNavigate, idSuffix = "" }) => {
  const { settings, currentUser, logout } = usePos();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar. Sampai jumpa!");
    navigate("/login");
  };

  const visibleMenu = menuItems.filter((m) => !m.roles || m.roles.includes(currentUser?.role));

  return (
    <div className="flex h-full flex-col bg-[#0F172A] text-slate-400">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
          <Store className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="font-heading text-xl font-extrabold tracking-tight text-white">EXAPOS</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500">Point of Sale</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {visibleMenu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            data-testid={item.testId + idSuffix}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-400 hover:bg-[#1E293B] hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-[#1E293B] px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-sm font-bold text-blue-400">
            {currentUser?.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{currentUser?.name}</p>
            <p className="text-xs text-blue-400">{currentUser?.role}</p>
          </div>
          <button
            data-testid={"logout-button" + idSuffix}
            onClick={handleLogout}
            title="Keluar"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <p className="px-1 text-center text-[10px] font-medium tracking-wider text-slate-600" data-testid="sidebar-watermark">
          {settings.watermark}
        </p>
      </div>
    </div>
  );
};

export default function Layout() {
  const { settings, currentUser } = usePos();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F8FAFC]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block xl:w-72">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            <SidebarContent onNavigate={() => setMobileOpen(false)} idSuffix="-mobile" />
          </aside>
          <button
            className="absolute right-4 top-4 rounded-lg bg-white p-2 text-slate-700"
            onClick={() => setMobileOpen(false)}
            data-testid="sidebar-close-button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-64 xl:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            data-testid="sidebar-open-button"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-blue-700" />
            <span className="text-sm font-semibold text-slate-800" data-testid="header-store-name">{settings.storeName}</span>
            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 sm:inline">
              Shift Aktif · {currentUser?.name?.split(" ")[0]}
            </span>
          </div>
          <div className="ml-auto">
            <LiveClock />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 py-4 text-center">
          <p className="text-xs font-medium tracking-wider text-slate-400" data-testid="footer-watermark">
            {settings.watermark}
          </p>
        </footer>
      </div>
    </div>
  );
}
