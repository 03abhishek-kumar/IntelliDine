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
  // Use first dish info for card layout simplification
  const mainItem = order.items && order.items.length > 0 ? order.items[0].dishId : { name: 'Unknown', type: 'Classic', prepTime: 0 };
  const TypeIcon = typeConfig[mainItem.type]?.icon || Star;
  const typeStyle = typeConfig[mainItem.type]?.gradient || '';
  const dateObj = new Date(order.createdAt || Date.now());
  const timeString = `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
  
  // Format estimated time
  const estDate = order.estimatedCompletionTime ? new Date(order.estimatedCompletionTime) : null;
  const estString = estDate ? `${estDate.getHours()}:${estDate.getMinutes().toString().padStart(2, '0')}` : 'TBD';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: order.status === 'ready' ? 100 : -100 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-5 rounded-[1.5rem] bg-royal-black/60 border border-white/10 backdrop-blur-xl group transition-all duration-300 ${typeConfig[mainItem.type]?.glow || ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${typeStyle}`}>
          <TypeIcon size={12} className={mainItem.type === 'Signature' ? 'animate-pulse' : ''} />
          {mainItem.type}
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
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
