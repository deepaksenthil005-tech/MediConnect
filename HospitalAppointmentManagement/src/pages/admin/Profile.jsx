import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, Mail, Phone, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { localDb } from '../../services/localDb';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
  });

  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || 'Not provided',
        age: user.age || 'N/A',
        gender: user.gender || 'Not specified',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await localDb.updateUser(user.id, form);
      updateUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your administrative credentials and personal information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Overview */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
            
            <div className="relative flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                  {user?.image_url ? (
                    <img src={user.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-slate-300">{user?.name?.[0] || 'A'}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-white">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 text-center">{user?.name || 'Administrator'}</h2>
              <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Hospital Admin
              </p>

              <div className="w-full mt-10 space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <p className="text-sm font-bold text-slate-900 break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <p className="text-sm font-bold text-slate-900">{form.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                      <p className="text-sm font-bold text-slate-900">{form.age} Yrs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <p className="text-sm font-bold text-slate-900">{form.gender}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Profile Details</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="admin-photo-input"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file && user) {
                      const reader = new FileReader();
                      reader.onloadend = async () => {
                        const base64 = reader.result;
                        await localDb.updateUserPhoto(user.id, base64);
                        window.location.reload();
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button 
                  onClick={() => document.getElementById('admin-photo-input').click()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/20"
                >
                  <Camera className="h-4 w-4" />
                  Change Photo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                  <input
                    disabled
                    value={form.email}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 font-bold outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                    <input
                      name="phone"
                      value={form.phone.replace('+91 ', '')}
                      onChange={handleChange}
                      className="w-full pl-16 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Age</label>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 transition-all font-bold text-slate-900"
                    placeholder="Years"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Gender Selection</label>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, gender: g }))}
                      className={`flex-1 py-4 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${
                        form.gender === g 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>


              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`px-10 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-sm ${
                    saved 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                      : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/20'
                  } shadow-xl active:scale-95`}
                >
                  {saved ? 'Changes Applied' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
