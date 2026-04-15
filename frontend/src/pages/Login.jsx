import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, ChefHat, Crown, UtensilsCrossed, MonitorDot, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ROLES = [
  { id: 'customer', label: 'Guest', icon: UtensilsCrossed, hint: 'Any email + password (6+ chars)' },
  { id: 'owner', label: 'Owner', icon: Crown, hint: 'owner@intellidine.com / owner123' },
  { id: 'chef', label: 'Chef', icon: ChefHat, hint: 'chef@intellidine.com / chef123' },
  { id: 'reception', label: 'Reception', icon: MonitorDot, hint: 'reception@intellidine.com / reception123' },
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
      <div className="absolute -top-32 left-[18%] w-[28rem] h-[28rem] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-28 right-[12%] w-[30rem] h-[30rem] bg-teal-400/16 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-slate-400/10 blur-[130px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl rotate-45 mb-5 border border-white/20 bg-white/10 backdrop-blur-xl"
          >
            <Shield className="text-sky-100 -rotate-45" size={26} />
          </motion.div>
          <h1 className="text-4xl font-royal tracking-tight text-slate-100 drop-shadow-[0_0_14px_rgba(134,181,255,0.28)]">
            INTELLIDINE
          </h1>
          <p className="text-slate-400 text-sm mt-2 tracking-widest uppercase">Smart Culinary Management</p>
        </div>

        {/* Card */}
        <div className="royal-glass glass-border rounded-3xl p-8 space-y-7 border-white/20 shadow-[0_24px_60px_rgba(3,12,23,0.5)]">
          {/* Role Selector */}
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Select Your Role</p>
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
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-md
                      ${isActive
                        ? 'bg-gradient-to-br from-blue-500/45 to-cyan-400/35 text-sky-50 shadow-[0_10px_30px_rgba(40,138,255,0.35),0_0_0_1px_rgba(156,222,255,0.35)_inset]'
                        : 'bg-[#0f1623]/70 border border-white/10 text-slate-400 shadow-[inset_0_2px_6px_rgba(0,0,0,0.55)] hover:bg-[#141f2f]/75 hover:text-slate-200'}`}
                  >
                    {isActive && <span className="absolute inset-0 rounded-2xl shadow-[0_0_28px_rgba(76,188,255,0.35)] pointer-events-none" />}
                    <Icon size={20} className={isActive ? 'text-sky-50' : 'text-slate-400'} />
                    <span className={`text-xs font-semibold tracking-widest uppercase ${isActive ? 'text-sky-50' : 'text-slate-400'}`}>
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
                className="text-[10px] text-slate-500 mt-2 text-center"
              >
                {activeRole.hint}
              </motion.p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                placeholder="your@email.com"
                className="soft-input"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  className="soft-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-100 transition-colors"
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-300/25"
                >
                  <AlertCircle size={14} className="text-red-300 shrink-0" />
                  <p className="text-xs text-red-200">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1f4b99] via-[#2277c8] to-[#26a6c0] text-slate-50 font-semibold tracking-[0.18em] text-sm
                shadow-[0_12px_28px_rgba(37,121,201,0.38)] hover:shadow-[0_16px_32px_rgba(42,155,214,0.46)] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Authenticating…
                </span>
              ) : `Enter as ${activeRole?.label}`}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6 tracking-wider">
          IntelliDine Royal Management System © 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
