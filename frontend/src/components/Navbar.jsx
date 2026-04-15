import React from 'react';
import { Shield, Bell, LogOut, ChefHat, Crown, MonitorDot, UtensilsCrossed, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ROLE_CONFIG = {
  customer:  { label: 'Guest',      icon: UtensilsCrossed, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  owner:     { label: 'Owner',      icon: Crown,           color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  chef:      { label: 'Chef',       icon: ChefHat,         color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
  reception: { label: 'Reception',  icon: MonitorDot,      color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
};

const Navbar = () => {
  const { user, role, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.customer;
  const RoleIcon = cfg.icon;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 md:px-6 py-4">
      <div className="royal-glass glass-border rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border-white/20">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => isAuthenticated && navigate(`/${role}`)}
      >
        <div className="w-10 h-10 bg-white rounded-lg rotate-45 flex items-center justify-center shadow-gold-glow shrink-0">
          <Shield className="text-black -rotate-45" size={20} />
        </div>
        <h1 className="text-2xl font-royal gold-text-gradient hidden sm:block tracking-tighter">
          INTELLIDINE
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* System status pill */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/8">
          <Activity size={13} className="text-white animate-pulse" />
          <span className="text-xs font-medium text-white/80 tracking-widest uppercase">Live</span>
        </div>

        {isAuthenticated && (
          <>
            {/* Role badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${cfg.border} ${cfg.bg} backdrop-blur-md`}>
              <RoleIcon size={13} className={cfg.color} />
              <span className={`text-xs font-medium ${cfg.color} uppercase tracking-widest`}>{cfg.label}</span>
            </div>

            {/* User name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-gold-glow">
                <span className="text-black text-xs font-royal font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-300 hidden md:block">{user?.name}</span>
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white
                bg-white/8 hover:bg-white/12 transition-all text-xs uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
