import { apiService } from '../../services/api';
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  UserRound,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Star,
  X,
  Clock,
  CheckCircle,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * USAGE GUIDE:
 * 1. This page allows administrators to manage the medical staff (Doctors).
 * 2. Search Bar: Filters doctors by name or specialization in real-time.
 * 3. Apply Filters: Click to toggle advanced filtering (currently by Specialization).
 * 4. Add/Edit Doctor: Use the modal to create new records or update existing ones.
 * 5. Data persistence is handled via `localDb` service.
 */

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState([]);
  const photoInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeSpecialization, setActiveSpecialization] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "General Physician",
    experience: "",
    qualification: "",
    availability: "Mon - Fri, 9:00 AM - 5:00 PM",
    fee: 500,
    bio: "",
    imageUrl: "https://picsum.photos/seed/doctor/200/200",
  });

  const specializations = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Psychiatrist",
    "Orthopedic",
    "Gynecologist",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const data = await apiService.getDoctors();
    setDoctors(data);
    setLoading(false);
  };

  const handleOpenModal = (doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData(doctor);
    } else {
      setEditingDoctor(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "General Physician",
        experience: "",
        qualification: "",
        availability: "Mon - Fri, 9:00 AM - 5:00 PM",
        fee: 500,
        bio: "",
        imageUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
      });
    }
    setIsModalOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setFormData((prev) => ({ ...prev, imageUrl: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingDoctor) {
      await apiService.updateDoctor(editingDoctor._id || editingDoctor.id, formData);
    } else {
      await apiService.addDoctor(formData);
    }
    setIsModalOpen(false);
    fetchDoctors();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      await apiService.deleteDoctor(id);
      fetchDoctors();
    }
  };

  // Improved filtering logic with Search and Category Filter
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeSpecialization === "All" ||
        doc.specialization === activeSpecialization;

      return matchesSearch && matchesFilter;
    });
  }, [doctors, searchQuery, activeSpecialization]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Doctors Management
          </h1>
          <p className="text-slate-500">
            Manage your medical staff and their schedules.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md font-bold transition-all shadow-md shadow-emerald-200"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4">
        <div className="premium-card !p-4 flex flex-col md:flex-row md:items-center gap-4 border-none shadow-md relative z-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="premium-input pl-16 py-4 !rounded-md"
            />
          </div>
          <div className="flex items-center space-x-4 pr-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-6 py-4 rounded-md transition-all font-black uppercase tracking-widest text-[10px] ${showFilters ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              {filteredDoctors.length} Specialists Found
            </div>
          </div>
        </div>

        {/* Expandable Filter Menu */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="premium-card !p-4 flex flex-wrap gap-2 border-none bg-slate-50/50 backdrop-blur-sm">
                <button
                  onClick={() => setActiveSpecialization("All")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSpecialization === "All" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-100"}`}
                >
                  All Specialists
                </button>
                {specializations.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSpecialization(s)}
                    className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeSpecialization === s ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-100"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor._id || doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="premium-card !p-0 overflow-hidden group hover:!shadow-md transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent 
opacity-100 lg:opacity-0 lg:group-hover:opacity-100 
transition-opacity duration-500 flex items-end p-4 md:p-6 lg:p-8"
                >
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => handleOpenModal(doctor)}
                      className="flex-1 py-2 md:py-3 bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white rounded-md transition-all flex items-center justify-center border border-white/30"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(doctor._id || doctor.id)}
                      className="flex-1 py-2 md:py-3 bg-rose-500/80 backdrop-blur-xl hover:bg-rose-600 text-white rounded-md transition-all flex items-center justify-center border border-rose-500/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-md flex items-center gap-1.5 shadow-md border border-white">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black text-slate-900 leading-none">
                    4.8
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                    {doctor.name}
                  </h3>
                  <span className="badge-premium bg-emerald-50 text-emerald-600 border-emerald-100">
                    {doctor.specialization}
                  </span>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-3 rounded-md bg-slate-50 border border-slate-100/50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                      <Mail size={14} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-black text-slate-900 truncate">
                      {doctor.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-md bg-slate-50 border border-slate-100/50">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {doctor.experience} Experience
                    </span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">
                      Consultation Fee
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      ₹{doctor.fee}
                    </p>
                  </div>
                  <button className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all flex items-center justify-center border border-slate-100/50">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-md shadow-xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Enter the doctor's professional details.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="p-10 max-h-[70vh] overflow-y-auto space-y-10 no-scrollbar"
              >
                {/* Profile Photo Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-100 shadow-lg">
                      <img
                        src={formData.imageUrl}
                        alt="Doctor photo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white h-7 w-7" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                  >
                    Upload Photo
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Full Identity
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="premium-input !py-4"
                      placeholder="Dr. Sarah Johnson"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Clinical Specialty
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      className="premium-input !py-4 appearance-none"
                    >
                      {specializations.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Communications
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="premium-input !py-4"
                      placeholder="sarah.j@clinic.com"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Direct Line
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="premium-input !py-4"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Field Experience
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="premium-input !py-4"
                      placeholder="e.g. 15 Years"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Consultation Protocol (₹)
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.fee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fee: parseInt(e.target.value) || 0,
                        })
                      }
                      className="premium-input !py-4"
                      placeholder="750"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Academic Credentials
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.qualification}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qualification: e.target.value,
                        })
                      }
                      className="premium-input !py-4"
                      placeholder="MBBS, MD, FRCP"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Standard Availability
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.availability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: e.target.value,
                        })
                      }
                      className="premium-input !py-4"
                      placeholder="Available 24/7"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Professional Narrative
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="premium-input !py-4 resize-none no-scrollbar"
                      placeholder="Expertise in respiratory diagnostics..."
                    />
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-slate-100 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button type="submit" className="flex-1 py-5 btn-premium">
                    {editingDoctor ? "Update Records" : "Authorize Specialty"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
