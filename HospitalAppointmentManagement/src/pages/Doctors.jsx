import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Stethoscope } from 'lucide-react';
import { apiService } from "../services/api";
import { useAuth } from '../context/AuthContext';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getDoctors().then((data) => {
      setDoctors(data);
      setIsLoading(false);
    });
  }, []);

  const handleBook = (doctorId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/dashboard/book-appointment?doctor=${doctorId}`);
  };

  const specialties = [
    'All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
    'Gynecologist', 'Dentist', 'Orthopedic Surgeon', 'ENT Specialist', 'Ophthalmologist',
    'Psychiatrist', 'Endocrinologist', 'Gastroenterologist', 'Urologist', 'Physiotherapist'
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Our Medical Specialists</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Find the right specialist for your healthcare needs and book an appointment instantly.</p>
      </div>

      <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="md:w-64 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
          <p className="text-gray-500 font-medium">Loading specialists...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-md">
          <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
