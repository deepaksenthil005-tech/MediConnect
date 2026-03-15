import React from 'react';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">MediConnect</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Empowering healthcare through technology. We connect patients with the best medical professionals for a healthier tomorrow.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-emerald-500 transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-emerald-500 transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-emerald-500 transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span>123 Healthcare Ave, Medical City</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span>support@mediconnect.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} MediConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
