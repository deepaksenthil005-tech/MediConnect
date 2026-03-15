import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, User, UserRound, ThumbsUp, Quote, Calendar, TrendingUp } from 'lucide-react';
import { localDb } from '../../services/localDb';
import { motion } from 'framer-motion';

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    const data = await localDb.getFeedback();
    setFeedback(data);
    setLoading(false);
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100'}`} />
      ))}
    </div>
  );

  const averageRating = feedback.length > 0 
    ? (feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Reviews</h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">Analyzing service quality and patient satisfaction metrics.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex items-center gap-6">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Satisfaction</p>
                 <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black text-slate-900">{averageRating}</h2>
                    <div className="flex items-center text-emerald-500">
                       <TrendingUp className="h-4 w-4" />
                       <span className="text-xs font-black">+1.2%</span>
                    </div>
                 </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                 <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregating Feedback</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="col-span-full bg-white p-32 rounded-[4rem] border-4 border-dashed border-slate-100 text-center">
            <Quote className="h-16 w-16 text-slate-100 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900">No Patient Reviews Yet</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto">Feedback from clinical consultations will appear here.</p>
          </div>
        ) : (
          feedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-200/20 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                 <Quote className="h-12 w-12 text-slate-50 opacity-50 group-hover:text-emerald-50 transition-colors" />
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center text-emerald-600 font-black text-3xl overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.patient_name)}&background=random`} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                     <span className="text-xs font-black text-amber-500">{item.rating}</span>
                  </div>
                </div>
                <div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">{item.patient_name}</h4>
                   <div className="flex items-center gap-4 mt-1">
                      {renderStars(item.rating)}
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase">
                         <Calendar className="h-3 w-3" />
                         {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-white shadow-inner mb-8 transition-colors group-hover:bg-emerald-50/30">
                <p className="text-slate-600 font-bold leading-relaxed italic text-lg line-clamp-3">"{item.comment}"</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <UserRound className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Regarding Specialist</p>
                      <p className="text-sm font-black text-slate-900">Dr. {item.doctor_name}</p>
                   </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-2xl transition-all active:scale-95">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Acknowledge</span>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
