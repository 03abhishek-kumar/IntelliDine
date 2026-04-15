import React from 'react';
import { Shield, Bell, LogOut, ChefHat, Crown, MonitorDot, UtensilsCrossed, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ROLE_CONFIG = {
  customer:  { label: 'Guest',      icon: UtensilsCrossed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  owner:     { label: 'Owner',      icon: Crown,           color: 'text-royal-gold',  bg: 'bg-royal-gold/10',  border: 'border-royal-gold/20' },
  chef:      { label: 'Chef',       icon: ChefHat,         color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  reception: { label: 'Reception',  icon: MonitorDot,      color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20' },
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
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-royal-gold/10 bg-royal-black/80 backdrop-blur-md">
      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => isAuthenticated && navigate(`/${role}`)}
      >
        <div className="w-10 h-10 bg-gold-gradient rounded-lg rotate-45 flex items-center justify-center shadow-gold-glow shrink-0">
          <Shield className="text-royal-black -rotate-45" size={20} />
        </div>
        <h1 className="text-2xl font-royal gold-text-gradient hidden sm:block tracking-tighter">
          INTELLIDINE
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* System status pill */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-royal-gold/20 bg-royal-gold/5">
          <Activity size={13} className="text-royal-gold animate-pulse" />
          <span className="text-xs font-medium text-royal-gold/80 tracking-widest uppercase">Live</span>
        </div>

        {isAuthenticated && (
          <>
            {/* Role badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${cfg.border} ${cfg.bg}`}>
              <RoleIcon size={13} className={cfg.color} />
              <span className={`text-xs font-medium ${cfg.color} uppercase tracking-widest`}>{cfg.label}</span>
            </div>

            {/* User name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-glow">
                <span className="text-royal-black text-xs font-royal font-bold">
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
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 text-red-400
                hover:bg-red-500/10 transition-all text-xs uppercase tracking-widest"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Logout</span>
            </motion.button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
