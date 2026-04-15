import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuthStore();
  const [role, setRole] = useState('customer');
  const [password, setPassword] = useState('password'); // Defaulting for hackathon demo

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(role, password);
    // Once successful, App.jsx routing auto-redirects
  };

  return (
    <div className="min-h-screen bg-royal-black flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-royal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-royal-amber/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-3xl royal-glass shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gold-gradient rounded-xl rotate-45 flex items-center justify-center shadow-gold-glow mb-6">
            <Shield className="text-royal-black -rotate-45" size={32} />
          </div>
          <h2 className="text-3xl font-royal gold-text-gradient tracking-widest uppercase">IntelliDine</h2>
          <p className="text-gray-400 font-playfair italic mt-2">Enter the Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-royal-gold/80 ml-2">Access Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black/40 border border-royal-gold/20 rounded-xl p-4 text-white focus:outline-none focus:border-royal-gold text-lg"
            >
              <option value="customer">Customer Experience</option>
              <option value="reception">Reception Override</option>
              <option value="chef">Chef Dashboard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-royal-gold/80 ml-2">Passcode</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-royal-gold/20 rounded-xl p-4 text-white focus:outline-none focus:border-royal-gold tracking-[0.2em]"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-4 bg-gold-gradient text-royal-black font-royal uppercase tracking-widest py-4 rounded-xl shadow-gold-glow hover:scale-[1.02] transition-transform font-bold text-lg"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
