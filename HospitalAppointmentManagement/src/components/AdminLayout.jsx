import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarCheck,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Doctors", icon: UserRound, path: "/admin/doctors" },
    { name: "Patients", icon: Users, path: "/admin/patients" },
    { name: "Appointments", icon: CalendarCheck, path: "/admin/appointments" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
    { name: "Profile", icon: User, path: "/admin/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  React.useEffect(() => {
    if (!showNotifications || notifications.length > 0) return;
    setLoadingNotifications(true);
    // Use the same notification service as patient for now or admin specific one if exists
    import("../services/localDb").then(({ localDb }) => {
      localDb
        .getNotifications()
        .then((data) => setNotifications(data.slice().reverse()))
        .finally(() => setLoadingNotifications(false));
    });
  }, [showNotifications]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col premium-sidebar sticky top-0 h-screen z-30"
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center shrink-0">
              <CalendarCheck className="h-5 w-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                MediConnect
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link-premium ${isActive ? "active" : ""}`}
              >
                <item.icon size={20} className="shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-md p-1 shadow-sm hover:bg-slate-50 transition-colors"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </button>
      </motion.aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <Link to="/admin" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">
                    MediConnect
                  </span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="premium-header h-20 px-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-slate-900 tracking-tight font-black">
              MediConnect
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-md text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all relative"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-[-190px] m-0 w-80 bg-white rounded-md shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 font-black text-xs uppercase tracking-widest text-slate-400">
                      Notifications
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
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
                className="flex items-center gap-3 p-1.5 pr-4 rounded-md bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-md shadow-slate-900/10 group"
              >
                <div className="w-9 h-9 rounded-md bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all">
                  {user?.image_url ? (
                    <img
                      src={user.image_url}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-black text-sm">
                      {user?.name?.[0] || "A"}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-black text-white leading-none uppercase tracking-widest">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </p>
                  <p className="text-[8px] font-bold text-white/50 uppercase tracking-[0.2em] leading-none mt-1">
                    Management
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
                        label: "Identity Settings",
                        path: "/admin/profile",
                      },
                      {
                        icon: Bell,
                        label: "Alert Protocol",
                        path: "/admin/notifications",
                      },
                      {
                        icon: Settings,
                        label: "System Control",
                        path: "/admin/settings",
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
                      <LogOut size={14} /> <span>Terminate Session</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>

        <footer className="bg-white border-t border-slate-200 py-4 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-medium">
              © {new Date().getFullYear()} MediConnect Admin Portal. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
