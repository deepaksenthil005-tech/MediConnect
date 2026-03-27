import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white rounded-md border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={doctor.imageUrl || `https://picsum.photos/seed/${doctor.id}/400/600`}
          alt={doctor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md flex items-center space-x-1 shadow-sm">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-800">4.9</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
          <p className="text-emerald-600 font-medium text-sm uppercase tracking-wider">{doctor.specialization}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{doctor.experience} Years Experience</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            <span>Medical City, NY</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Consultation Fee</p>
            <p className="text-lg font-bold text-gray-900">${doctor.fee}</p>
          </div>
          <button
            onClick={() => onBook?.(doctor.id)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
