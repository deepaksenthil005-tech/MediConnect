import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2 shrink-0">
            <div className="bg-emerald-500 p-2 rounded-md">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">MediConnect</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${isActive(link.path) ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {user && !['/login', '/register'].includes(location.pathname) ? (
              <div className="flex items-center space-x-3 md:space-x-6">
                <Link
                  to="/dashboard"
                  className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1">
                    Patient
                  </span>
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-all font-bold text-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Patient Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : !['/login', '/register'].includes(location.pathname) ? (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-emerald-600 font-medium px-4 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-sm"
                >
                  Join Us
                </Link>
              </div>
            ) : null}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-all ${isActive(link.path)
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 flex flex-col space-y-2 sm:hidden">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-md text-base font-medium bg-emerald-600 text-white text-center shadow-sm">
                    Join Us
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
