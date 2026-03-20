import React, { useState, useRef, useEffect } from 'react';
import { Send, Video, VideoOff, Mic, MicOff, PhoneOff, Image, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from "../../services/api";
import { motion, AnimatePresence } from 'motion/react';

export default function Consultation() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [micOn, setMicOn] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    if (!user) return;
    apiService.getConsultationMessages(user.id).then((stored) => {
      if (stored.length > 0) {
        setMessages(stored);
      } else {
        const seed = [
          { id: 1, text: 'Hello! I am Dr. Sarah. How can I assist you with your health concerns today?', sent: false, sender: 'DOCTOR' },
          { id: 2, text: 'I am experiencing some mild cough and fatigue since yesterday.', sent: true, sender: 'PATIENT' },
        ];
        setMessages(seed);
      }
      setTimeout(scrollToBottom, 50);
    });
  }, [user]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input.trim();
    const message = { text, sent: true, sender: 'PATIENT', created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, { ...message, id: Date.now() }]);
    if (user) {
      apiService.addConsultationMessage(user.id, message);
    }
    setInput('');
    setTimeout(scrollToBottom, 100);

    // Auto-reply simulation
    setTimeout(() => {
      const reply = { text: "I understand. Could you please let me know if you also have a fever? I'll review your symptoms.", sent: false, sender: 'DOCTOR', created_at: new Date().toISOString() };
      setMessages(prev => [...prev, { ...reply, id: Date.now() + 1 }]);
      scrollToBottom();
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar/Docs info */}
      <div className="hidden lg:flex w-80 flex-col gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 border-4 border-white shadow-lg mx-auto overflow-hidden">
               <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-1/2 translate-x-12 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black text-slate-900 leading-tight">Dr. Sarah Johnson</h3>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-[9px] mt-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block">Consulting Doctor</p>
          </div>
          <div className="mt-8 space-y-4">
             <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-[11px] text-slate-500 font-medium leading-relaxed">
               "Providing expert medical guidance for respiratory and general health concerns."
             </div>
             <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-lg active:scale-95">View Profile</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex-1 overflow-hidden flex flex-col">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Clinical Files</h4>
          <div className="space-y-3 overflow-y-auto no-scrollbar pr-1">
             {[
               { name: 'X-Ray Report.pdf', size: '2.4 MB', date: '12 Mar' },
               { name: 'Blood Test.jpg', size: '1.1 MB', date: '10 Mar' },
               { name: 'Prescription_V1.pdf', size: '0.8 MB', date: '05 Mar' }
             ].map((file, i) => (
               <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                    <Paperclip size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{file.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{file.size} • {file.date}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Main Chat/Video Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <div className="lg:hidden w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black border border-emerald-100">S</div>
             <div>
               <h3 className="font-black text-slate-900 leading-none">Consultation Thread</h3>
               <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Session</span>
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 shadow-lg shadow-slate-900/20 transition-all active:scale-95">
              <PhoneOff size={16} className="rotate-[135deg]" /> 
              <span className="hidden sm:inline">Emergency Support</span>
            </button>
            <div className="w-px h-8 bg-slate-100 mx-2" />
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Search size={20} /></button>
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20} /></button>
          </div>
        </div>


        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 no-scrollbar">
           <div className="mx-auto px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
             Today, March 14
           </div>

           <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex w-full ${m.sent ? 'justify-end' : 'justify-start'}`}
              >
                {!m.sent && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-[10px] shrink-0 self-end mb-2 mr-3">
                    S
                  </div>
                )}
                <div className={`max-w-[75%] lg:max-w-[60%] px-6 py-4 rounded-[2rem] shadow-lg shadow-slate-900/5 relative ${
                  m.sent 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-50'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                  <div className={`flex items-center gap-1.5 mt-2 justify-end ${m.sent ? 'text-emerald-200' : 'text-slate-400'}`}>
                    <span className="text-[10px] font-bold">
                      {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {m.sent && <div className="text-[10px] font-black">✓✓</div>}
                  </div>
                </div>
              </motion.div>
            ))}
           </AnimatePresence>
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-50 flex items-center gap-4 z-30">
          <div className="flex items-center gap-1">
             <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><Smile size={24} /></button>
             <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"><Paperclip size={24} /></button>
          </div>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Describe your health symptoms..." 
              className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white outline-none transition-all font-bold text-slate-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
          </div>
          <button 
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              input.trim() 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 active:scale-95' 
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
