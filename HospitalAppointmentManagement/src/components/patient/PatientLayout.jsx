import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import {
  LayoutDashboard,
  Search,
  CalendarPlus,
  CalendarCheck,
  MessageCircle,
  Heart,
  FileText,
  Star,
  User,
  Settings,
  LogOut,
  Bell,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import "../../styles/patient-dashboard.css";

const menuItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/find-doctors", icon: Search, label: "Find Doctors" },
  {
    to: "/dashboard/book-appointment",
    icon: CalendarPlus,
    label: "Book Appointment",
  },
  {
    to: "/dashboard/my-appointments",
    icon: CalendarCheck,
    label: "My Appointments",
  },
  { to: "/dashboard/health-report", icon: Heart, label: "Health Report" },
  { to: "/dashboard/prescriptions", icon: FileText, label: "Prescriptions" },
  { to: "/dashboard/reviews", icon: Star, label: "Reviews" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function PatientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!showNotifications || notifications.length > 0) return;
    setLoadingNotifications(true);
    apiService
      .getNotifications()
      .then((data) => setNotifications(data.slice().reverse()))
      .finally(() => setLoadingNotifications(false));
  }, [showNotifications, notifications.length]);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <aside
        className={`premium-sidebar hidden lg:flex flex-col sticky top-0 h-screen z-30 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-[280px]"}`}
      >
        <Link to="/dashboard" className="patient-dashboard__sidebar-logo">
          <div className="patient-dashboard__sidebar-logo-icon">
            <CalendarCheck size={10} />
          </div>
          {!sidebarCollapsed && (
            <span className="patient-dashboard__sidebar-logo-text">
              MediConnect
            </span>
          )}
        </Link>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `nav-link-premium ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={22} className="shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          <button
            type="button"
            className="nav-link-premium w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 mt-4 group"
            onClick={handleLogout}
          >
            <LogOut size={22} className="shrink-0" />
            {!sidebarCollapsed && <span className="font-bold">Logout</span>}
          </button>
        </nav>
        <button
          type="button"
          className="patient-dashboard__sidebar-toggle"
          onClick={() => setSidebarCollapsed((c) => !c)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Menu */}
          <div className="absolute left-0 top-20 h-full w-[320px] bg-white shadow-xl p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-5 p-4 rounded-md hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="premium-header h-20 px-1 sticky top-0 z-40 bg-white">
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              <Menu size={24} />
            </button>
            <Link
              to="/dashboard"
              className="lg:hidden flex items-center space-x-2"
            >
              <span className="text-xl font-bold text-slate-900 tracking-tight font-black">
                MediConnect
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-2.5 rounded-md text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all relative"
                onClick={() => setShowNotifications((v) => !v)}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  
                </span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-[-190px] mt-5 w-80 bg-white rounded-md shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400">
                      Notifications
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar ">
                      {loadingNotifications ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="p-4 rounded-md hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="text-sm font-black text-slate-900 mb-1">
                              {n.title}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
                              {n.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar on the Right */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-md bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 transition-all h-auto shadow-md shadow-slate-900/10"
              >
                <div className="w-9 h-9 rounded-md bg-emerald-100 border border-emerald-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (

                    <span className="text-emerald-600 font-black text-sm">
                      {user?.name?.[0] || "P"}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-black text-white leading-none uppercase tracking-widest">
                    {user?.name?.split(" ")[0] || "Patient"}
                  </p>
                  <p className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] leading-none mt-1">
                    Health Dossier
                  </p>
                </div>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-64 bg-white rounded-md shadow-xl border border-slate-100 z-50 p-2"
                  >
                    <div className="p-4 border-b border-slate-50 mb-2">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                    {[
                      {
                        icon: User,
                        label: "Medical Profile",
                        path: "/dashboard/profile",
                      },
                      {
                        icon: Heart,
                        label: "Clinical Vitals",
                        path: "/dashboard/health-report",
                      },
                      {
                        icon: Settings,
                        label: "Preferences",
                        path: "/dashboard/settings",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          navigate(item.path);
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3.5 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-all"
                      >
                        <item.icon size={14} /> <span>{item.label}</span>
                      </button>
                    ))}
                    <div className="h-px bg-slate-50 my-2 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3.5 rounded-md text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <LogOut size={14} /> <span>End Session</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
