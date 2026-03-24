import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "../../services/api";
import {
  Star,
  Search,
  MapPin,
  Clock,
  Calendar,
  X,
  ChevronRight,
  Award,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

/**
 * USAGE GUIDE:
 * 1. This page allows patients to browse available doctors.
 * 2. It fetches data from `localDb` and provides real-time filtering.
 * 3. Components are modularized for better maintainability:
 *    - SearchFilterHeader: Handles search and filter inputs.
 *    - DoctorCard: Displays individual doctor summaries.
 *    - DoctorModal: Shows detailed doctor profiles when selected.
 * 4. To add new filters:
 *    - Update the `filters` state object.
 *    - Add new input fields in `SearchFilterHeader`.
 *    - Update the filtering logic inside the main `FindDoctors` component.
 */

const SPECIALIZATIONS = [
  "All",
  "General Physician",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Dermatologist",
  "Psychiatrist",
];

export default function FindDoctors() {
  const navigate = useNavigate();

  // -- State Management --
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: "All",
    experience: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // -- Data Fetching --
  useEffect(() => {
    // Fetches doctor data from local storage service
    apiService.getDoctors().then((data) => {
      console.log("Doctors API response:", data);
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  // -- Filtering Logic (Memoized for performance) --
  const filteredDoctors = useMemo(() => {
    let result = doctors;

    // Filter by Specialization
    if (filters.specialization !== "All") {
      result = result.filter(
        (d) => d.specialization === filters.specialization,
      );
    }

    // Filter by Experience
    if (filters.experience) {
      const minExp = parseInt(filters.experience);
      result = result.filter((d) => (d.experience || 0) >= minExp);
    }

    // Filter by Search Query (Name, Specialty, Bio)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query) ||
          (d.bio && d.bio.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [searchQuery, filters, doctors]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search and Filters Section */}
      <SearchFilterHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        resultsCount={filteredDoctors.length}
      />

      {/* Results Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc.id}
              doc={doc}
              onViewProfile={() => setSelectedDoctor(doc)}
            />
          ))}
          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-medium">
                No doctors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Doctor Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            onBook={() =>
              navigate(
                `/dashboard/book-appointment?doctor=${selectedDoctor._id}`,
              )
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

/**
 * SearchFilterHeader component handles the search bar and filter dropdowns.
 */
function SearchFilterHeader({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  resultsCount,
}) {
  return (
    <div className="premium-card !p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Find Your Specialist
          </h3>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Discover top-rated doctors and book your visit in seconds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge-premium bg-emerald-50 text-emerald-600 border-emerald-100">
            {resultsCount} Doctors Found
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, specialty, or bio..."
            className="premium-input !pl-14"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Specialization Filter */}
        <select
          className="premium-input appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
          value={filters.specialization}
          onChange={(e) =>
            setFilters((f) => ({ ...f, specialization: e.target.value }))
          }
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Experience Filter */}
        <select
          className="premium-input appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciLz48L3N2Zz4=')] bg-[length:1.25rem] bg-[right_1.25rem_center] bg-no-repeat"
          value={filters.experience}
          onChange={(e) =>
            setFilters((f) => ({ ...f, experience: e.target.value }))
          }
        >
          <option value="">Min. Experience</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>
    </div>
  );
}

/**
 * DoctorCard displays a summary of a doctor's information.
 */
function DoctorCard({ doc, onViewProfile }) {
  return (
    <motion.div
      layout
      className="premium-card !p-0 overflow-hidden group hover:!shadow-md transition-all duration-500 flex flex-col"
    >
      <div className="relative p-8 pb-0">
        {/* Availability Badge */}
        <div className="absolute top-1 right-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10 bg-emerald-50 text-emerald-600 border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          Available
        </div>

        <div className="flex gap-6 mb-8">
          {/* Doctor Image */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-md overflow-hidden bg-slate-100 border-4 border-white shadow-md">
              <img
                src={
                  doc.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&size=100`
                }
                alt={doc.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-md shadow-sm border border-slate-50">
              <Award size={14} className="text-emerald-500" />
            </div>
          </div>

          {/* Info Side */}
          <div className="min-w-0 pt-2">
            <h4 className="text-lg font-black text-slate-900 truncate leading-tight mb-1">
              {doc.name}
            </h4>
            <p className="text-emerald-600 font-bold text-xs uppercase tracking-wider">
              {doc.specialization}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    fill={s <= 4 ? "#f59e0b" : "none"}
                    color="#f59e0b"
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-700">4.8</span>
              <span className="text-[10px] font-bold text-slate-400">
                (120+ Reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-slate-50 border border-slate-100 mb-8">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Experience
            </p>
            <p className="text-sm font-black text-slate-900">
              {doc.experience || 8}+ Years
            </p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Fee
            </p>
            <p className="text-sm font-black text-emerald-600">
              ₹{doc.fee || 500}
            </p>
          </div>
        </div>
      </div>

      {/* Access Actions */}
      <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
        <button
          onClick={onViewProfile}
          className="btn-premium-outline flex-1 py-4 text-[10px]"
        >
          View Profile
        </button>
        <Link
          to={`/dashboard/book-appointment?doctor=${doc.id}`}
          className="btn-premium flex-[1.5] py-4 text-[10px] bg-emerald-600 hover:bg-emerald-700"
        >
          BOOK NOW
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * DoctorModal provides details and booking access for a specific doctor.
 */
function DoctorModal({ doctor, onClose, onBook }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-md overflow-hidden shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 rounded-md hover:bg-rose-50 hover:text-rose-600 transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-4 md:p-10 h-[600px] overflow-y-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md overflow-hidden bg-slate-100 border-4 border-white shadow-md shrink-0">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-black text-slate-900">
                  {doctor.name}
                </h2>
                <CheckCircle
                  size={20}
                  className="text-emerald-500"
                  fill="currentColor"
                />
              </div>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">
                {doctor.specialization}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-md">
                  <Award size={16} className="text-amber-500" />
                  <span className="text-xs font-black text-slate-700">
                    {doctor.experience || 8}+ Yrs Exp
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-md">
                  <Star size={16} className="text-amber-500" />
                  <span className="text-xs font-black text-slate-700">
                    4.8 (120+ Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* About Text */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  About Doctor
                </h4>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Dr. {doctor.name.split(" ").pop()} is a highly skilled{" "}
                  {doctor.specialization.toLowerCase()} with extensive clinical
                  experience. Dedicated to providing compassionate,
                  evidence-based care tailored to each patient's unique needs.
                </p>
              </div>

              {/* Timing */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Consultation Hours
                </h4>
                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mon - Fri</span>
                    <span className="text-slate-900">09:00 AM - 05:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Saturday</span>
                    <span className="text-slate-900">10:00 AM - 02:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-slate-50 rounded-md p-6 border border-slate-100">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                Patient Feedback
              </h4>
              <div className="space-y-6">
                {[
                  {
                    name: "Rahul S.",
                    rating: 5,
                    text: "Great experience, very professional.",
                  },
                  {
                    name: "Ananya K.",
                    rating: 4,
                    text: "Good listener and provided clear advice.",
                  },
                ].map((rev, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                        {rev.name}
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={8}
                            fill={s <= rev.rating ? "#f59e0b" : "none"}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-10 flex gap-4">
            <button
              onClick={onBook}
              className="flex-1 py-5 rounded-md font-black uppercase tracking-widest text-[10px] shadow-md transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20 active:scale-95"
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Placeholder skeletons shown while data is loading.
 */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-[450px] bg-slate-100 rounded-md animate-pulse"
        />
      ))}
    </div>
  );
}
