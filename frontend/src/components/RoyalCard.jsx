import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Flame, CheckCircle2, ChevronRight, Clock, Star, FlameKindling, Crown, Coffee } from 'lucide-react';

const typeConfig = {
  Signature: { icon: Crown, gradient: 'bg-gold-gradient text-royal-black shadow-gold-glow', glow: 'shadow-[0_0_20px_rgba(212,175,55,0.3)]' },
  Premium: { icon: Star, gradient: 'bg-gradient-to-r from-gray-200 to-white text-royal-black', glow: 'shadow-[0_0_15px_rgba(255,255,255,0.2)]' },
  Classic: { icon: FlameKindling, gradient: 'bg-white/10 text-white border border-white/20 hover:bg-white/20', glow: '' },
  Dessert: { icon: Coffee, gradient: 'bg-gradient-to-r from-[#d4af37]/20 to-transparent text-[#d4af37] border border-[#d4af37]/30', glow: '' }
};

const RoyalCard = ({ order, onAdvance }) => {
  const statusColors = {
    pending: 'bg-white/6',
    cooking: 'bg-white/8',
    ready: 'bg-white/5',
  };

  const statusIcons = {
    pending: <Clock className="text-white/90" size={16} />,
    cooking: <Zap className="text-white animate-pulse" size={16} />,
    ready: <ChevronRight className="text-white/90" size={16} />,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: order.status === 'ready' ? 100 : -100 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-5 rounded-[1.5rem] bg-royal-black/60 border border-white/10 backdrop-blur-xl group transition-all duration-300 ${typeConfig[mainItem.type]?.glow || ''}`}
    >
      {/* Background Gradient Accent */}
      <div className={`absolute inset-0 ${statusColors[order.status]} opacity-40 pointer-events-none`}></div>

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
          <div className="p-2 rounded-lg bg-white/8 border border-white/15">
            {statusIcons[order.status]}
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 border-y border-white/5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
            <User size={14} className="text-white" />
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
            className="flex items-center gap-1 text-white/85 font-medium uppercase tracking-widest text-[10px] group-hover:text-white transition-colors"
          >
            Advance <ChevronRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoyalCard;
