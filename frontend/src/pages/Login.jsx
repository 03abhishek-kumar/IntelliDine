import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, ChefHat, Crown, UtensilsCrossed, MonitorDot, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ROLES = [
  { id: 'customer', label: 'Guest', icon: UtensilsCrossed, border: 'border-white/20', active: 'border-white bg-white/14', text: 'text-white', hint: 'Any email + password (6+ chars)' },
  { id: 'owner', label: 'Owner', icon: Crown, border: 'border-white/20', active: 'border-white bg-white/14', text: 'text-white', hint: 'owner@intellidine.com / owner123' },
  { id: 'chef', label: 'Chef', icon: ChefHat, border: 'border-white/20', active: 'border-white bg-white/14', text: 'text-white', hint: 'chef@intellidine.com / chef123' },
  { id: 'reception', label: 'Reception', icon: MonitorDot, border: 'border-white/20', active: 'border-white bg-white/14', text: 'text-white', hint: 'reception@intellidine.com / reception123' },
];

const ROLE_ROUTES = { customer: '/customer', owner: '/owner', chef: '/chef', reception: '/reception' };

const Login = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const activeRole = ROLES.find(r => r.id === selectedRole);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    clearError();
    const defaults = {
      owner: 'owner@intellidine.com',
      chef: 'chef@intellidine.com',
      reception: 'reception@intellidine.com',
    };
    setEmail(defaults[roleId] || '');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password, selectedRole);
      if (success) {
        navigate(ROLE_ROUTES[selectedRole] || '/customer');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-32 left-[18%] w-[28rem] h-[28rem] bg-white/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-28 right-[12%] w-[30rem] h-[30rem] bg-white/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-white/8 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl rotate-45 shadow-gold-glow mb-5"
          >
            <Shield className="text-black -rotate-45" size={28} />
          </motion.div>
          <h1 className="text-4xl font-royal gold-text-gradient tracking-tight">INTELLIDINE</h1>
          <p className="text-gray-400 text-sm mt-2 tracking-widest uppercase">Royal Culinary Management</p>
        </div>

        {/* Card */}
        <div className="royal-glass glass-border rounded-3xl p-8 space-y-7 border-white/20">
          {/* Role Selector */}
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Select Your Role</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isActive = selectedRole === role.id;
                return (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md
                      ${isActive ? `${role.active} shadow-[0_8px_24px_rgba(255,255,255,0.08)]` : `border-white/15 bg-white/[0.05] ${role.border} hover:bg-white/10`}`}
                  >
                    <Icon size={20} className={isActive ? role.text : 'text-gray-500'} />
                    <span className={`text-xs font-medium tracking-widest uppercase ${isActive ? role.text : 'text-gray-500'}`}>
                      {role.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            {activeRole && (
              <motion.p
                key={selectedRole}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-gray-600 mt-2 text-center"
              >
                {activeRole.hint}
              </motion.p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                placeholder="your@email.com"
                className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-gray-100 text-sm placeholder-gray-500
                  focus:outline-none focus:border-white/40 focus:bg-white/[0.14] transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 pr-12 text-gray-100 text-sm placeholder-gray-500
                    focus:outline-none focus:border-white/40 focus:bg-white/[0.14] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/8 border border-white/15"
                >
                  <AlertCircle size={14} className="text-white shrink-0" />
                  <p className="text-xs text-gray-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl bg-white text-black font-royal tracking-widest text-sm
                shadow-gold-glow hover:shadow-gold-glow-strong transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                  Authenticating…
                </span>
              ) : `Enter as ${activeRole?.label}`}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6 tracking-wider">
          IntelliDine Royal Management System © 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
