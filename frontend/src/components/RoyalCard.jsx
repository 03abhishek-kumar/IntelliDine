import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, ChevronRight, Zap } from 'lucide-react';

const RoyalCard = ({ order, onAdvance }) => {
  const statusColors = {
    pending: 'from-amber-500/20 to-transparent',
    cooking: 'from-blue-500/20 to-transparent',
    ready: 'from-emerald-500/20 to-transparent',
  };

  const statusIcons = {
    pending: <Clock className="text-amber-400" size={16} />,
    cooking: <Zap className="text-blue-400 animate-pulse" size={16} />,
    ready: <ChevronRight className="text-emerald-400" size={16} />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 50 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative group overflow-hidden rounded-2xl royal-glass p-5 ${order.status === 'cooking' ? 'animate-glow' : ''}`}
    >
      {/* Background Gradient Accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusColors[order.status]} opacity-20 pointer-events-none`}></div>

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-royal-gold/60 font-medium">
              {order.type} Order
            </span>
            <h3 className="text-lg font-royal gold-text-gradient leading-tight">
              {order.dish}
            </h3>
          </div>
          <div className="p-2 rounded-lg bg-royal-gold/5 border border-royal-gold/10">
            {statusIcons[order.status]}
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 border-y border-white/5">
          <div className="w-8 h-8 rounded-full bg-royal-gold/10 flex items-center justify-center border border-royal-gold/20">
            <User size={14} className="text-royal-gold" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Assigned To</p>
            <p className="text-sm font-medium text-gray-200">{order.chef}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{order.time}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdvance(order.id)}
            className="flex items-center gap-1 text-royal-gold font-medium uppercase tracking-widest text-[10px] group-hover:text-white transition-colors"
          >
            Advance <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoyalCard;
