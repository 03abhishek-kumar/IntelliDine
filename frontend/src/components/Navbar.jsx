import React from 'react';
import { Shield, Bell, Menu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-royal-gold/10 bg-royal-black/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Menu className="text-royal-gold cursor-pointer md:hidden" />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gold-gradient rounded-lg rotate-45 flex items-center justify-center shadow-gold-glow">
            <Shield className="text-royal-black -rotate-45" size={20} />
          </div>
          <h1 className="text-2xl font-royal gold-text-gradient hidden sm:block tracking-tighter">
            INTELLIDINE
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full border border-royal-gold/20 bg-royal-gold/5">
          <Activity size={14} className="text-royal-gold animate-pulse" />
          <span className="text-xs font-medium text-royal-gold/80 tracking-widest uppercase">
            System Synchronized
          </span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full border border-royal-gold text-royal-gold font-royal text-sm tracking-widest hover:bg-royal-gold hover:text-royal-black transition-all duration-300 shadow-gold-glow"
        >
          COMMAND CENTER
        </motion.button>

        <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-full transition-colors">
          <Bell className="text-royal-gold/80" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-royal-black"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
