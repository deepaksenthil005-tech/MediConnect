import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Bell, Database, Activity, MessageSquare } from 'lucide-react';

export default function Services() {
  const services = [
    { title: 'Appointment Booking', desc: 'Search and book doctors instantly.', icon: Search },
    { title: 'Smart Scheduling', desc: 'Real-time availability management.', icon: Calendar },
    { title: 'Medical Records', desc: 'Securely store your health history.', icon: Database },
    { title: 'Reminders', desc: 'Never miss an appointment with automated alerts.', icon: Bell },
    { title: 'Status Tracking', desc: 'Track your booking and consultation status in real-time.', icon: Activity },
    { title: 'Chat with Admin', desc: 'Direct messaging with our support team for any queries.', icon: MessageSquare },
  ];

  return (
    <div className="bg-white">
      <section className="py-20 bg-emerald-600 text-center text-white px-4">
        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl md:text-5xl font-extrabold mb-4">
          Our Services
        </motion.h1>
        <p className="text-emerald-50 max-w-2xl mx-auto">Efficient digital solutions connecting patients and doctors.</p>
      </section>

      <section className="py-16 max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div key={i} className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <s.icon className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="py-16 text-center px-4">
        <h2 className="text-3xl font-bold mb-6">Ready to book?</h2>
        <Link to="/doctors" className="btn-primary inline-block">Book Appointment</Link>
      </section>
    </div>
  );
}
