import React from 'react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ChefHat, 
  Settings, 
  LogOut,
  TrendingUp,
  History
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-royal-gold/10 text-royal-gold border-l-4 border-royal-gold' : 'text-gray-400 hover:text-royal-gold'}`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium tracking-wide">{label}</span>
  </div>
);

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-80px)] border-r border-royal-gold/10 bg-royal-black/40 backdrop-blur-md p-4">
      <div className="flex-1 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Kitchen Dashboard" active />
        <SidebarItem icon={UtensilsCrossed} label="Order Management" />
        <SidebarItem icon={ChefHat} label="Chef Stations" />
        <SidebarItem icon={History} label="Order History" />
        <SidebarItem icon={TrendingUp} label="Performance Insights" />
      </div>

      <div className="pt-4 border-t border-white/5 space-y-2">
        <SidebarItem icon={Settings} label="System Settings" />
        <SidebarItem icon={LogOut} label="Shutdown System" />
        
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-royal-gold/10 to-transparent border border-royal-gold/10">
          <p className="text-[10px] text-royal-gold/60 uppercase tracking-widest mb-1">Current Shift</p>
          <p className="text-sm font-royal text-royal-gold">Evening Service</p>
          <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-royal-gold shadow-gold-glow"
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
