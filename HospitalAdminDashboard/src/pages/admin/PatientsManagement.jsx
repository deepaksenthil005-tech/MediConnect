import { apiService } from '../../services/api';
import React, { useEffect, useState, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  Trash2,
  Mail,
  Calendar,
  History,
  X,
  User,
  FileText,
  Activity,
  Plus,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReportViewerModal from "../../components/ReportViewerModal";

export default function PatientsManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientHealth, setPatientHealth] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("history"); // 'history' | 'health'
  const [filters, setFilters] = useState({ ageRange: "All" });

  // Health form state for admin-editable values
  const [healthForm, setHealthForm] = useState({
    weight: "",
    height: "",
    heartRate: "",
    bloodOxygen: "",
    stressLevel: "Low",
  });
  const [healthSaved, setHealthSaved] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const data = await apiService.getPatients();
    setPatients(data);
    setLoading(false);
  };

  const handleViewDetails = async (patient) => {
    try {
      setSelectedPatient(patient);
      setActiveTab("history");

      const patientId = patient._id;

      const [appointments, health] = await Promise.all([
        apiService.getAppointments(),
        apiService.getHealthReport(patientId),
      ]);

      const filteredAppointments = appointments.filter(
        (apt) =>
          apt.patientId === patientId ||
          apt.patient_id === patientId ||
          apt.patient?._id === patientId
      );

      setPatientAppointments(filteredAppointments);
      setPatientHealth(health || {});

      setHealthForm({
        weight: health?.weight || "",
        height: health?.height || "",
        heartRate: health?.heartRate || "",
        bloodOxygen: health?.bloodOxygen || "",
        stressLevel: health?.stressLevel || "Low",
      });

      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("View details error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deletePatient(id);
      setPatients((prev) => prev.filter((patient) => patient._id !== id));
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  const handleSaveHealth = async (e) => {
    e.preventDefault();
    await apiService.saveHealthReport((selectedPatient._id || selectedPatient.id), {
      weight: parseFloat(healthForm.weight) || 0,
      height: parseFloat(healthForm.height) || 0,
      heartRate: parseInt(healthForm.heartRate) || 0,
      bloodOxygen: parseInt(healthForm.bloodOxygen) || 0,
      stressLevel: healthForm.stressLevel,
    });
    const updated = await apiService.getHealthReport(selectedPatient._id || selectedPatient.id);
    setPatientHealth(updated);
    setHealthSaved(true);
    setTimeout(() => setHealthSaved(false), 2500);
  };

  const handleAddRecord = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const record = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    };
    await apiService.addMedicalRecord(selectedPatient._id, record);
    const updated = await apiService.getHealthReport(selectedPatient._id);
    setPatientHealth(updated);
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Remove this record?")) return;
    const reports = JSON.parse(
      localStorage.getItem("mediconnect_health_reports") || "[]",
    );
    const idx = reports.findIndex((r) => r.patient_id === selectedPatient._id);
    if (idx !== -1) {
      reports[idx].medicalRecords = (reports[idx].medicalRecords || []).filter(
        (r) => r._id !== recordId,
      );
      localStorage.setItem(
        "mediconnect_health_reports",
        JSON.stringify(reports),
      );
    }
    const updated = await apiService.getHealthReport(selectedPatient._id || selectedPatient.id);
    setPatientHealth(updated);
  };

  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    const patientId = `re-${1000 + p.id}`.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      patientId.includes(query) ||
      (p.phone && p.phone.includes(query));
    let matchesAge = true;
    if (filters.ageRange !== "All") {
      const age = parseInt(p.age) || 0;
      if (filters.ageRange === "Under 18") matchesAge = age < 18;
      else if (filters.ageRange === "18-60")
        matchesAge = age >= 18 && age <= 60;
      else if (filters.ageRange === "Over 60") matchesAge = age > 60;
    }
    return matchesSearch && matchesAge;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Patients Management
        </h1>
        <p className="text-slate-500">
          View, manage and update patient health records.
        </p>
      </div>

      <div className="premium-card !p-2 flex flex-col md:flex-row md:items-center gap-4 border-none shadow-md">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by ID, name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="premium-input pl-16 py-4 !rounded-md"
          />
        </div>
        <div className="flex items-center space-x ">
          <button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`flex items-center space-x-2 px-6 py-4 rounded-md transition-all font-black uppercase tracking-widest text-[10px] ${isFilterVisible ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
          >
            <Filter className="h-4 w-4" />
            <span>Refine Search</span>
          </button>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">
            {filteredPatients.length} Registered Accounts
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="premium-card !p-6 border-none shadow-md bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Age Demographic
                  </label>
                  <select
                    value={filters.ageRange}
                    onChange={(e) =>
                      setFilters({ ...filters, ageRange: e.target.value })
                    }
                    className="premium-input py-3 !rounded-md !text-sm appearance-none"
                  >
                    <option value="All">All Ages</option>
                    <option value="Under 18">Children (Under 18)</option>
                    <option value="18-60">Adults (18-60)</option>
                    <option value="Over 60">Seniors (Over 60)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Accessing Secure Records
            </p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="premium-card p-12 text-center border-4 border-dashed border-slate-100">
            <Users size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">
              No matching patient records found.
            </p>
          </div>
        ) : (
          filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="premium-card flex flex-col xl:flex-row xl:items-center justify-around gap-3 hover:shadow-md transition-all group p-2"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-md bg-slate-50 border-2 border-white shadow-md flex items-center justify-center text-emerald-600 font-black text-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {patient.name?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                    {patient.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      ID:{parseInt(patient?._id?.slice(-4), 16)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      {patient.age || "N/A"} Years
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1 max-w-2xl px-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Communications
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Mail size={12} className="text-emerald-500" />
                    {patient.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Clinical Log
                  </p>
                  <p className="text-xs font-bold text-slate-500 line-clamp-1 italic">
                    "{patient.medical_history || "Clear records"}"
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewDetails(patient)}
                  className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-md font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-slate-900/10"
                >
                  <History size={14} /> Full History
                </button>
                <button
                  onClick={() => handleDelete(patient._id)}
                  className="p-4 bg-rose-50 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-3xl rounded-md shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-md bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-emerald-200">
                    {selectedPatient.name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {selectedPatient.email} · {selectedPatient.age || "N/A"}{" "}
                      yrs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="p-2 hover:bg-white rounded-md transition-colors shadow-sm"
                >
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-white px-6">
                {[
                  {
                    id: "history",
                    label: "Appointments & History",
                    icon: History,
                  },
                  { id: "health", label: "Health Records", icon: Activity },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    <tab.icon size={14} /> {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* ---- HISTORY TAB ---- */}
                {activeTab === "history" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Email", value: selectedPatient.email },
                        {
                          label: "Phone",
                          value: selectedPatient.phone || "N/A",
                        },
                        {
                          label: "Age",
                          value: `${selectedPatient.age || "N/A"} Years`,
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="p-4 rounded-md bg-slate-50 border border-slate-100"
                        >
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                            {label}
                          </p>
                          <p className="text-sm font-bold text-slate-900 break-all">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <History size={14} className="text-emerald-500" />{" "}
                        Medical History
                      </h3>
                      <div className="p-4 rounded-md bg-emerald-50/50 border border-emerald-100 text-slate-700 text-sm leading-relaxed">
                        {selectedPatient.medical_history ||
                          "No medical history records found for this patient."}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <Calendar size={14} className="text-blue-500" />{" "}
                        Appointment History
                      </h3>
                      <div className="space-y-3">
                        {patientAppointments.length > 0 ? (
                          patientAppointments.map((apt) => (
                            <div
                              key={apt._id || apt.id}
                              className="flex items-center justify-between p-4 rounded-md bg-white border border-slate-100 shadow-sm"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2.5 bg-slate-50 rounded-md">
                                  <User className="h-4 w-4 text-slate-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    with {apt.doctor_name || apt.doctorName || apt.doctor?.name || "Unknown Doctor"}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {(apt.date || "No date")} at {(apt.time || "No time")}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${apt.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : apt.status === "CANCELLED"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {apt.status || "PENDING"}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No appointments found.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ---- HEALTH RECORDS TAB ---- */}
                {activeTab === "health" && patientHealth && (
                  <>
                    {/* Vitals Form */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500" />{" "}
                        Update Patient Vitals
                      </h3>
                      <form
                        onSubmit={handleSaveHealth}
                        className="grid grid-cols-2 gap-4"
                      >
                        {[
                          {
                            label: "Weight (kg)",
                            key: "weight",
                            type: "number",
                            step: "0.1",
                          },
                          {
                            label: "Height (cm)",
                            key: "height",
                            type: "number",
                          },
                          {
                            label: "Heart Rate (bpm)",
                            key: "heartRate",
                            type: "number",
                          },
                          {
                            label: "Blood Oxygen (%)",
                            key: "bloodOxygen",
                            type: "number",
                          },
                        ].map(({ label, key, type, step }) => (
                          <div key={key} className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {label}
                            </label>
                            <input
                              type={type}
                              step={step}
                              value={healthForm[key]}
                              onChange={(e) =>
                                setHealthForm((f) => ({
                                  ...f,
                                  [key]: e.target.value,
                                }))
                              }
                              className="premium-input !py-3"
                              placeholder={label}
                            />
                          </div>
                        ))}
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Stress Level
                          </label>
                          <select
                            value={healthForm.stressLevel}
                            onChange={(e) =>
                              setHealthForm((f) => ({
                                ...f,
                                stressLevel: e.target.value,
                              }))
                            }
                            className="premium-input !py-3 appearance-none"
                          >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button
                            type="submit"
                            className={`flex items-center gap-2 px-6 py-3 rounded-md font-black uppercase tracking-widest text-[10px] transition-all ${healthSaved ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-emerald-600"}`}
                          >
                            {healthSaved ? (
                              <>
                                <CheckCircle size={14} /> Saved!
                              </>
                            ) : (
                              "Save Vitals"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Medical Records */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <FileText size={14} className="text-blue-500" />{" "}
                          Medical Records
                        </h3>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-md font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all"
                        >
                          <Plus size={14} /> Add Record
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleAddRecord}
                        />
                      </div>
                      <div className="space-y-3">
                        {(patientHealth.medicalRecords || []).length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-md text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            No medical records yet. Click "Add Record" to
                            upload.
                          </div>
                        ) : (
                          (patientHealth.medicalRecords || []).map((record) => (
                            <div
                              key={record.id}
                              className="flex items-center justify-between p-4 rounded-md bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-emerald-50 rounded-md flex items-center justify-center">
                                  <FileText
                                    size={16}
                                    className="text-emerald-600"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-900">
                                    {record.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {record.date} · {record.size}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setViewingRecord(record)}
                                  className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                                >
                                  View Report
                                </button>
                                <button
                                  onClick={() => handleDeleteRecord(record._id)}
                                  className="p-2 bg-rose-50 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-md hover:bg-slate-50 transition-all shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Viewer Modal */}
      {viewingRecord && patientHealth && (
        <ReportViewerModal
          record={viewingRecord}
          healthData={patientHealth}
          patientId={selectedPatient?.id || selectedPatient?._id}
          patientName={selectedPatient?.name}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </div>
  );
}
