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
  customer:  { label: 'Guest Portal',      icon: UtensilsCrossed, color: 'text-white', shift: 'Dining Experience' },
  owner:     { label: 'Owner Console',     icon: Crown,           color: 'text-white', shift: 'Management View' },
  chef:      { label: 'Chef Station',      icon: ChefHat,         color: 'text-white', shift: 'Kitchen Active' },
  reception: { label: 'Reception Desk',    icon: MonitorDot,      color: 'text-white', shift: 'Front of House' },
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.div
    whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all backdrop-blur-md
      ${active
        ? 'bg-white/12 text-white border-l-4 border-white shadow-[0_8px_20px_rgba(255,255,255,0.12)]'
        : 'text-gray-300 hover:text-white border-l-4 border-transparent'}`}
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
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-88px)] royal-glass glass-border rounded-2xl ml-4 mb-4 p-4 shrink-0">
      {/* Role badge */}
      <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-white/[0.07] border border-white/10">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-gold-glow shrink-0">
          <span className="font-royal text-black text-sm font-bold">{user?.name?.[0]}</span>
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
      <div className="pt-4 border-t border-white/10 space-y-2">
        <SidebarItem icon={LogOut} label="Sign Out" onClick={handleLogout} />

        <div className="mt-4 p-4 rounded-2xl bg-white/6 border border-white/20">
          <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Current Shift</p>
          <p className="text-sm font-royal text-white">{meta.shift}</p>
          <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-white shadow-gold-glow"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
