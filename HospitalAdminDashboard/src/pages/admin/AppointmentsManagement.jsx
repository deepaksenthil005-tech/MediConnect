import { apiService } from '../../services/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Search, Clock, CheckCircle2, XCircle, MoreVertical, Calendar, ChevronDown, Activity, FileText, Heart, Droplets, Scale, Ruler, X, UserRound, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppointmentsManagement() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [selectedPatientReport, setSelectedPatientReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [aptData, docData] = await Promise.all([apiService.getAppointments(), apiService.getDoctors()]);
    setAppointments(aptData);
    setDoctors(docData);
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await apiService.updateAppointmentStatus(id, newStatus);
    fetchData();
  };

  const handleViewPatientReport = async (patientId) => {
    const reportData = await apiService.getHealthReport(patientId);
    setSelectedPatientReport(reportData);
    setIsReportModalOpen(true);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || apt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === 'ALL' || apt.doctor_id?.toString() === doctorFilter;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'CONFIRMED': return { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Confirmed' };
      case 'PENDING': return { color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Under Review' };
      case 'COMPLETED': return { color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', label: 'Completed' };
      case 'CANCELLED': return { color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', label: 'Cancelled' };
      default: return { color: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', label: status };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Consultation Hub</h1>
          <p className="text-slate-500 text-lg mt-3 font-medium">Manage patient appointments and diagnostic reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-4 bg-white rounded-md border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=D${i}&background=random`} alt="" />
                </div>
              ))}
            </div>
            <p className="text-sm font-black text-slate-900">{filteredAppointments.length} Total Sessions</p>
          </div>
        </div>
      </div>

      <div className="premium-card !p-4 border-none shadow-md transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by patient identity or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input pl-16 py-5 !rounded-md"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group min-w-[180px]">
              <Activity className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none z-10" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="premium-input pl-12 pr-10 py-5 !rounded-2xl appearance-none cursor-pointer font-black text-slate-600 uppercase tracking-widest text-[10px]"
              >
                <option value="ALL">Status Flow</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none transition-transform group-hover:translate-y-1" />
            </div>
            <div className="relative group min-w-[200px]">
              <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors pointer-events-none z-10" />
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="premium-input pl-12 pr-10 py-5 !rounded-2xl appearance-none cursor-pointer font-black text-slate-600 uppercase tracking-widest text-[10px]"
              >
                <option value="ALL">All Specialists</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id.toString()}>{doc.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none transition-transform group-hover:translate-y-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Compiling Records</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white p-16 rounded-md border-4 border-dashed border-slate-100 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-md items-center justify-center flex mx-auto mb-8 shadow-inner">
              <CalendarCheck className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Zero Results Found</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">No appointments matched your current filter criteria.</p>
          </div>
        ) : (
          filteredAppointments.map((apt, index) => {
            const status = getStatusInfo(apt.status);
            return (
              <motion.div
                key={apt._id || apt.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="premium-card  p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:!shadow-md transition-all duration-500 group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-2 h-full ${status.color}`} />
                <div className="flex items-center gap-8">
                  <div className="relative group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <div className="w-20 h-20 rounded-md border-4 border-white shadow-md overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient_name)}&background=random`} className="w-full h-full object-cover" alt="" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3
                        className="text-2xl font-black text-slate-900 cursor-pointer hover:text-emerald-600 transition-colors leading-tight"
                        onClick={() => handleViewPatientReport(apt.patient_id)}
                      >
                        {apt.patient_name}
                      </h3>
                      <div className={`px-4 py-1.5 rounded-full ${status.bg} ${status.text} text-[9px] font-black uppercase tracking-widest border border-current`}>
                        {status.label}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                          <UserRound className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                          <p className="text-xs font-black text-slate-900">Dr. {apt.doctor_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                          <Calendar className="h-4 w-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                          <p className="text-xs font-black text-slate-900">{new Date(apt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {apt.time}</p>
                        </div>
                      </div>
                    </div>
                    {apt.previous_report && (
                      <div className="mt-6 flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-md border border-amber-100">
                          <FileText size={12} className="text-amber-600" />
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Medical History</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px]">{apt.previous_report.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 xl:mt-0">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-md border border-slate-100/50">
                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'CONFIRMED')}
                        className="btn-premium py-4 px-8 text-[10px] gap-2 shadow-emerald-500/10"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                    )}
                    {apt.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'COMPLETED')}
                        className="btn-premium py-4 px-8 text-[10px] gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                      >
                        <CheckCircle2 size={14} /> Finalize
                      </button>
                    )}
                    {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'CANCELLED')}
                        className="w-14 h-14 bg-white text-rose-500 border border-slate-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 rounded-md transition-all shadow-sm active:scale-95 flex items-center justify-center p-0"
                      >
                        <XCircle size={20} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewPatientReport(apt.patient_id)}
                    className="w-16 h-16 bg-slate-900 text-white rounded-md flex items-center justify-center hover:bg-emerald-600 transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <FileText size={24} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isReportModalOpen && selectedPatientReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative bg-white w-full max-w-4xl rounded-md shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
            >
              <div className="p-8 pb-6 border-b border-slate-50 flex items-start justify-between">
                <div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Secure Diagnostics</div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Health Dossier</h2>
                  <p className="text-slate-500 text-lg font-medium mt-1">Analyzing vital metrics for clinical review.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      // Logic to trigger vital update (simulated for demo)
                      alert('Vital update interface for admin is active');
                    }}
                    className="px-6 py-4 bg-emerald-600 text-white rounded-md font-black uppercase tracking-widest text-[10px] shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-95"
                  >
                    Update Vitals
                  </button>
                  <button onClick={() => setIsReportModalOpen(false)} className="p-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-md transition-all text-slate-300 active:scale-90">
                    <X className="h-8 w-8" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto space-y-12">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { icon: Scale, label: 'Weight', value: `${selectedPatientReport.weight} kg`, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { icon: Ruler, label: 'Height', value: `${selectedPatientReport.height} cm`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { icon: Heart, label: 'Heart Rate', value: `${selectedPatientReport.heartRate} bpm`, color: 'text-rose-500', bg: 'bg-rose-50' },
                    { icon: Droplets, label: 'Oxygen', value: `${selectedPatientReport.bloodOxygen}%`, color: 'text-blue-400', bg: 'bg-blue-50' },
                    { icon: Activity, label: 'Stress', value: selectedPatientReport.stressLevel, color: 'text-amber-500', bg: 'bg-amber-50' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-md ${stat.bg} border-2 border-white shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1`}>
                      <stat.icon className={`h-8 w-8 ${stat.color} mb-6`} />
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-md border border-white shadow-inner">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-600 rounded-md flex items-center justify-center p-2.5">
                        <FileText className="text-white" />
                      </div>
                      Clinical Records
                    </h3>
                    <label className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                      <FileText className="h-3 w-3" />
                      Upload New Report
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              try {
                                const record = {
                                  name: file.name,
                                  size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                                  date: new Date().toLocaleDateString(),
                                  data: reader.result // Store Base64 data
                                };
                                await apiService.addMedicalRecord(selectedPatientReport.patientId, record);
                                handleViewPatientReport(selectedPatientReport.patientId);
                              } catch (error) {
                                console.error('Upload failed:', error);
                                alert('Failed to upload medical record. Please try again.');
                              }
                            };
                            reader.readAsDataURL(file);
                            reader.onerror = (error) => {
                              console.error('File reading failed:', error);
                              alert('Failed to read file.');
                            };
                          }
                        }}
                      />
                    </label>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPatientReport.medicalRecords && selectedPatientReport.medicalRecords.length > 0 ? (
                    selectedPatientReport.medicalRecords.map((record, index) => (
                      <div key={record._id || record.id || index} className="p-6 rounded-md bg-white border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
                          <div className="flex items-center space-x-5">
                            <div className="w-14 h-14 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                              <FileText className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-lg font-black text-slate-900">{record.name}</p>
                              <p className="text-xs font-bold text-slate-400">{record.date} • {record.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (record.data) {
                                const win = window.open();
                                win.document.write(`<iframe src="${record.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                              } else {
                                alert('This is a legacy record without digital data.');
                              }
                            }}
                            className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-16 text-center border-4 border-dashed border-slate-100 rounded-md">
                        <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No Digitized Records Available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 bg-white">
                <button onClick={() => setIsReportModalOpen(false)} className="w-full py-6 bg-slate-900 hover:bg-emerald-600 text-white text-xl font-black rounded-md transition-all shadow-md active:scale-95">
                  Confirm Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
