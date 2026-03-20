import React, { useState } from "react";
import { Lock, Bell, Shield, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("password");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    system_alerts: true,
    new_appointments: true,
    feedback: true,
    platform_updates: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "password", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Data", icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Configure your administrative preferences and security.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* TABS */}
        <div className="flex overflow-x-auto border-b border-slate-50 p-3 md:p-4 gap-2 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-white text-emerald-600 shadow-lg shadow-emerald-900/5 border border-emerald-100"
                  : "text-slate-400 hover:text-slate-600 hover:bg-white"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-10">
          <AnimatePresence mode="wait">
            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSave}
                className="space-y-6 md:space-y-8 max-w-xl"
              >
                <div className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">
                      Current Password
                    </label>

                    <input
                      type="password"
                      className="w-full px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl bg-white border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm md:text-base text-slate-700"
                      placeholder="••••••••••••"
                      value={passwordForm.current}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          current: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">
                      New Password
                    </label>

                    <input
                      type="password"
                      className="w-full px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl bg-white border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm md:text-base text-slate-700"
                      placeholder="Minimum 8 characters"
                      value={passwordForm.new}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, new: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 md:ml-4">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      className="w-full px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl bg-white border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-sm md:text-base text-slate-700"
                      placeholder="Repeat new password"
                      value={passwordForm.confirm}
                      onChange={(e) =>
                        setPasswordForm((f) => ({
                          ...f,
                          confirm: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-emerald-600 shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
                >
                  {saved ? "Security Settings Updated" : "Change Password"}
                </button>
              </motion.form>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3 md:space-y-4 max-w-2xl"
              >
                {Object.keys(notifications).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-100 transition-all"
                  >
                    <div>
                      <h4 className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">
                        {key.replace("_", " ")}
                      </h4>

                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-0.5">
                        Receive alerts for important {key.split("_")[0]} events.
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setNotifications((n) => ({ ...n, [key]: !n[key] }))
                      }
                      className={`w-12 md:w-14 h-7 md:h-8 rounded-full transition-all relative flex items-center px-1 ${
                        notifications[key] ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 md:w-6 h-5 md:h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                          notifications[key]
                            ? "translate-x-5 md:translate-x-6"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-amber-50 border border-amber-100 max-w-2xl">
                  <div className="flex gap-3 md:gap-4">
                    <Shield className="text-amber-600 shrink-0" size={22} />
                    <div>
                      <h4 className="font-black text-amber-900 text-sm">
                        Data Privacy Note
                      </h4>
                      <p className="text-[11px] md:text-xs font-medium text-amber-700 leading-relaxed mt-1">
                        As an administrator, you have access to sensitive
                        patient data. Ensure your session is secure and follow
                        HIPAA-compliant protocols when handling records.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100">
                    <span className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">
                      Show Status as Online
                    </span>

                    <button className="w-12 md:w-14 h-7 md:h-8 rounded-full bg-emerald-500 relative flex items-center px-1">
                      <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-white translate-x-5 md:translate-x-6" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 border border-slate-100">
                    <span className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">
                      Share Anonymous Usage Data
                    </span>

                    <button className="w-12 md:w-14 h-7 md:h-8 rounded-full bg-slate-300 relative flex items-center px-1">
                      <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-white transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
