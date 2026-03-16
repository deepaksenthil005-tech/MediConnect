import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../services/localDb';
import { 
  ChevronRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  AlertCircle, 
  ArrowLeft,
  Stethoscope,
  ChevronLeft,
  FileText,
  Upload,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const STEPS = ['Select Doctor', 'Choose Date', 'Select Time', 'Confirm'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const doctorIdParam = searchParams.get('doctor');
  const { user } = useAuth();
  
  const [doctors, setDoctors] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previousReport, setPreviousReport] = useState(null);

  useEffect(() => {
    localDb.getDoctors().then(data => {
      setDoctors(data);
      if (doctorIdParam) {
        const d = data.find(doc => doc.id === parseInt(doctorIdParam, 10));
        if (d) {
          setSelectedDoctor(d);
          setStep(2);
        }
      }
    });
  }, [doctorIdParam]);

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) return;
    setSubmitting(true);
    try {
      await localDb.createAppointment({
        patient_id: user.id,
        doctor_id: selectedDoctor.id,
        patient_name: user.name,
        doctor_name: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        previous_report: previousReport ? { name: previousReport.name, size: previousReport.size, date: new Date().toLocaleDateString() } : null,
        status: 'PENDING'
      });

      await localDb.sendNotification({
        title: 'New Appointment Request',
        message: `${user.name} has requested an appointment with ${selectedDoctor.name}.`,
        type: 'APPOINTMENT',
      });

      setSuccess(true);
    } catch (e) {
      alert(e.message || 'Failed to book');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 size={48} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Booking Successful!</h2>
        <p className="text-slate-500 font-medium mb-12">Your appointment request has been sent to {selectedDoctor?.name}. You'll be notified once it's confirmed.</p>
        <button 
          onClick={() => navigate('/dashboard/my-appointments')}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
        >
          View My Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="premium-card !p-6 md:!p-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Book Your Appointment</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Complete the steps below to schedule your session.</p>
        </div>

        {/* Dynamic Step Indicator */}
        <div className="flex items-center justify-between gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-12 overflow-x-auto no-scrollbar">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-3 shrink-0">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-[10px] md:text-xs transition-all duration-500 ${
                  step === i + 1 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-110' 
                    : step > i + 1 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-white text-slate-300 border border-slate-200'
                }`}>
                  {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${
                  step === i + 1 ? 'text-slate-900' : 'text-slate-400'
                }`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={16} className="text-slate-200 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {doctors.map((doc) => {
                  const isAvailable = doc.status === 'Available';
                  const isSelected = selectedDoctor?.id === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-2 rounded-3xl border-2 transition-all duration-300 flex items-center gap-6 group relative ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/30 shadow-lg shadow-emerald-900/5' 
                          : 'border-slate-50 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-900/5'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-md">
                        <img src={doc.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 className="text-md font-black text-slate-900 truncate leading-tight mb-1">{doc.name}</h3>
                         <p className="text-emerald-600 font-bold uppercase tracking-widest text-[9px] mb-3">{doc.specialization}</p>
                         <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-200'}`} />
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-emerald-600">
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto space-y-8"
              >
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Step 2</h4>
                      <p className="text-sm font-black text-slate-700">Choose a consultation date</p>
                    </div>
                  </div>
                  <input 
                    type="date" 
                    className="premium-input"
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <AlertCircle size={16} className="text-emerald-600 shrink-0" />
                    <p className="text-[10px] font-bold text-emerald-700 leading-relaxed italic">
                      Standard consultation hours are Monday to Saturday, 9 AM - 5 PM. Emergency cases should call the support line.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-xl mx-auto space-y-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`p-6 rounded-3xl font-black uppercase tracking-widest text-[10px] border-2 transition-all duration-300 ${
                        selectedTime === t 
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105' 
                          : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <div className="bg-slate-50 p-3 rounded-[5px] border border-slate-100 space-y-8">
                  <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-slate-200 ">
                    <img src={selectedDoctor?.image_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirming Appointment with</p>
                      <h4 className="text-xl font-black text-slate-900 mb-1">{selectedDoctor?.name}</h4>
                      <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">{selectedDoctor?.specialization}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-md border border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Scheduled Date</p>
                      <p className="text-sm font-black text-slate-900">{selectedDate}</p>
                    </div>
                    <div className="p-6 bg-white rounded-md border border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selected Time</p>
                      <p className="text-sm font-black text-slate-900">{selectedTime}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Reason for consultation (Optional)</label>
                    <textarea 
                      className="premium-input min-h-[120px] resize-none"
                      value={reason} 
                      onChange={(e) => setReason(e.target.value)} 
                      placeholder="e.g. Chronic headache, routine checkup..." 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Previous Medical Report (Optional)</label>
                    <div 
                      className={`relative p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                        previousReport ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/10'
                      }`}
                    >
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                             setPreviousReport({
                               name: file.name,
                               size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
                             });
                          }
                        }}
                      />
                      {previousReport ? (
                        <>
                          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <FileText className="text-emerald-600 w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black text-slate-900">{previousReport.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{previousReport.size}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPreviousReport(null);
                            }}
                            className="bg-rose-50 text-rose-500 p-2 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                            <Upload className="text-slate-300 w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black text-slate-900">Upload History Report</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="w-full max-w-xl mx-auto mt-5 border-t border-slate-100 flex items-center justify-around">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2  rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
              step === 1 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-5">
            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !selectedDoctor) || (step === 2 && !selectedDate) || (step === 3 && !selectedTime)}
                className="btn-premium px-4 md:px-12"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-premium px-4 md:px-12"
              >
                {submitting ? 'Confirming...' : 'Complete Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
