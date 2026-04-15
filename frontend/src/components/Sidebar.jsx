import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, UtensilsCrossed, ChefHat, History,
  TrendingUp, Settings, LogOut, Table2, Users, ShoppingBag,
  BookOpen, MonitorDot, Crown, Clock
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const ROLE_NAV = {
  customer: [
    { icon: UtensilsCrossed, label: 'Menu', path: '/customer' },
  ],
  owner: [
    { icon: LayoutDashboard, label: 'Overview',        path: '/owner' },
    { icon: BookOpen,         label: 'Menu Management', path: '/owner' },
    { icon: Users,            label: 'Staff',           path: '/owner' },
  ],
  chef: [
    { icon: ChefHat,   label: 'Kitchen Board', path: '/chef' },
  ],
  reception: [
    { icon: MonitorDot, label: 'Floor Monitor', path: '/reception' },
  ],
};

const ROLE_META = {
  customer:  { label: 'Guest Portal',      icon: UtensilsCrossed, color: 'text-emerald-400', shift: 'Dining Experience' },
  owner:     { label: 'Owner Console',     icon: Crown,           color: 'text-royal-gold',  shift: 'Management View' },
  chef:      { label: 'Chef Station',      icon: ChefHat,         color: 'text-blue-400',    shift: 'Kitchen Active' },
  reception: { label: 'Reception Desk',   icon: MonitorDot,      color: 'text-purple-400',  shift: 'Front of House' },
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(207,167,86,0.05)' }}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all
      ${active
        ? 'bg-royal-gold/10 text-royal-gold border-l-4 border-royal-gold'
        : 'text-gray-400 hover:text-royal-gold border-l-4 border-transparent'}`}
  >
    <Icon size={18} />
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </motion.div>
);

const Sidebar = () => {
  const { role, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!role) return null;

  const navItems  = ROLE_NAV[role]  || [];
  const meta      = ROLE_META[role] || ROLE_META.customer;
  const RoleIcon  = meta.icon;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-73px)] border-r border-royal-gold/10 bg-royal-black/40 backdrop-blur-md p-4 shrink-0">
      {/* Role badge */}
      <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-glow shrink-0">
          <span className="font-royal text-royal-black text-sm font-bold">{user?.name?.[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-200 font-medium truncate">{user?.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <RoleIcon size={10} className={meta.color} />
            <p className={`text-[10px] uppercase tracking-wider ${meta.color}`}>{meta.label}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 space-y-1 mt-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* Bottom: shift info + logout */}
      <div className="pt-4 border-t border-white/5 space-y-2">
        <SidebarItem icon={LogOut} label="Sign Out" onClick={handleLogout} />

        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-royal-gold/10 to-transparent border border-royal-gold/10">
          <p className="text-[10px] text-royal-gold/60 uppercase tracking-widest mb-1">Current Shift</p>
          <p className="text-sm font-royal text-royal-gold">{meta.shift}</p>
          <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-royal-gold shadow-gold-glow"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
