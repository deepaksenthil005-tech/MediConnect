import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, ShieldCheck, Clock, Calendar, Target, Database, Bell, Activity, MessageSquare } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white">
      <section className="py-20 bg-slate-50 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            About <span className="text-emerald-600">MediConnect</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            We are dedicated to revolutionizing healthcare accessibility. Our platform bridges the gap between patients and medical professionals through innovative digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/doctors" className="btn-primary px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200">
              Find a Doctor
            </Link>
            <Link to="/services" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              Our Services
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div whileHover={{ y: -5 }} className="p-10 bg-emerald-600 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100">
            <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-emerald-50 text-lg leading-relaxed">
              To empower every individual with seamless access to quality healthcare through smart scheduling, secure records, and instant communication.
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-50">
            <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To become the global standard for patient-doctor interaction, fostering a world where healthcare is just a click away for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MediConnect?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our platform is built on six core pillars designed to provide the best healthcare experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Seamless Booking', desc: 'Instant appointment scheduling with top-tier specialists.', icon: Calendar },
              { title: 'Smart Scheduling', desc: 'Real-time availability updates for efficient time management.', icon: Clock },
              { title: 'Secure Records', desc: 'Your medical history, stored safely and accessible anytime.', icon: Database },
              { title: 'Smart Reminders', desc: 'Automated alerts so you never miss a vital consultation.', icon: Bell },
              { title: 'Live Tracking', desc: 'Monitor your appointment and health status in real-time.', icon: Activity },
              { title: 'Admin Support', desc: 'Direct chat with administrators for immediate assistance.', icon: MessageSquare },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                  <item.icon className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <ShieldCheck className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Data Security is Our Priority</h2>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            We use industry-standard encryption and security protocols to ensure that your personal and medical information remains private and protected at all times.
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-50 grayscale">
            <div className="font-bold text-2xl">HIPAA</div>
            <div className="font-bold text-2xl">GDPR</div>
            <div className="font-bold text-2xl">ISO 27001</div>
          </div>
        </div>
      </section>
    </div>
  );
}
