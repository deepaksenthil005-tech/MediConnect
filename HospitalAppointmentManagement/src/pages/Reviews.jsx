import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { apiService } from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getFeedback().then((data) => {
      setReviews(data.slice().reverse());
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Patient Reviews</h1>
        <p className="text-gray-500">See what our patients have to say about their experience.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <Quote className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p className="text-lg font-semibold">No reviews yet. Be the first!</p>
            </div>
          ) : (
            reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl relative"
              >
                <Quote className="absolute top-6 right-8 h-10 w-10 text-emerald-100" />
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={r.patientImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.patientName)}&background=random&size=56`}
                    alt={r.patientName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{r.patientName}</h3>
                    <p className="text-sm text-emerald-600">Verified Patient</p>
                    {r.doctorName && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Reviewed: <span className="text-emerald-600">Dr. {r.doctorName}</span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, star) => (
                    <Star key={star} className={`h-4 w-4 ${star < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{r.comment}"</p>
                <p className="text-xs text-gray-400 mt-3">
                  {new Date(r.createdAt || r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
