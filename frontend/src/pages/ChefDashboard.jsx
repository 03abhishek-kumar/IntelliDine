import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Flame, CheckCircle2, Clock, User, Table2, UtensilsCrossed, Zap, Bell, Package } from 'lucide-react';
import useOrderStore from '../store/useOrderStore';
import useAuthStore from '../store/useAuthStore';

const STATUS_CONFIG = {
  pending:  { label: 'Awaiting Prep',   color: 'text-white', bg: 'bg-white/6', border: 'border-white/20', icon: Clock },
  cooking:  { label: 'In Progress',     color: 'text-white', bg: 'bg-white/8', border: 'border-white/20', icon: Flame },
  ready:    { label: 'Ready to Serve',  color: 'text-white', bg: 'bg-white/6', border: 'border-white/20', icon: CheckCircle2 },
};

const OrderCard = ({ order, onAdvance, chefMode }) => {
  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;
  const canAdvance = order.status !== 'ready' || !chefMode;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl royal-glass p-5 space-y-4 ${order.status === 'cooking' ? 'animate-glow' : ''}`}
    >
      <div className={`absolute inset-0 ${cfg.bg} pointer-events-none`} />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-royal-gold/50">{order.type} Order</span>
          <h3 className="text-base font-royal gold-text-gradient leading-tight mt-0.5">{order.dish}</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.border} bg-white/5`}>
          <Icon size={12} className={cfg.color} />
          <span className={`text-[10px] font-medium ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Items list */}
      {order.items && order.items.length > 0 && (
        <div className="relative z-10 bg-white/[0.03] rounded-xl p-3 space-y-1.5">
          <p className="text-[9px] uppercase tracking-widest text-gray-600 mb-2">Items</p>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="text-xs text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5">
          <Table2 size={12} className="text-white/70" />
          <div>
            <p className="text-[9px] text-gray-600 uppercase">Table</p>
            <p className="text-sm font-royal text-white">
              {order.serviceMode === 'delivery'
                ? 'Delivery'
                : order.serviceMode === 'take_away'
                  ? 'Take Away'
                  : `#${order.tableNo}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-gray-500" />
          <div>
            <p className="text-[9px] text-gray-600 uppercase">Guest</p>
            <p className="text-xs text-gray-300 truncate">{order.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-gray-500" />
          <div>
            <p className="text-[9px] text-gray-600 uppercase">Time</p>
            <p className="text-xs text-gray-300">{order.time}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-white/70" />
          <span className="text-xs text-gray-400">{order.chef}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAdvance(order.id)}
          disabled={order.status === 'ready'}
          className={`flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest transition-colors
            ${order.status === 'ready'
              ? 'text-white cursor-default'
              : 'text-white/85 hover:text-white cursor-pointer'}`}
        >
          {order.status === 'ready' ? 'Serve Now' : 'Advance'} <Zap size={12} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const KanbanColumn = ({ title, icon: Icon, orders, status, onAdvance, color }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.iconBg}`}>
          <Icon className={color.icon} size={18} />
        </div>
        <h2 className="text-sm font-royal tracking-widest uppercase text-white/85">{title}</h2>
      </div>
      <span className={`text-xs font-bold ${color.badge} bg-white/5 px-2.5 py-1 rounded-full font-mono`}>
        {orders.length}
      </span>
    </div>
    <div className="flex flex-col gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
      <AnimatePresence mode="popLayout">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onAdvance={onAdvance} chefMode />
        ))}
      </AnimatePresence>
      {orders.length === 0 && (
        <div className="h-36 flex flex-col items-center justify-center text-gray-700 border border-dashed border-white/10 rounded-2xl">
          <Package size={32} className="mb-2 opacity-20" />
          <p className="text-xs uppercase tracking-widest">Station Clear</p>
        </div>
      )}
    </div>
  </div>
);

const ChefDashboard = () => {
  const { orders, advanceStatus, alert } = useOrderStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('all');

  const chefEmail = useAuthStore.getState().user?.email;
  const myOrders = filter === 'mine' && chefEmail
    ? orders.filter(o => o.chefId === chefEmail)
    : orders;

  const stats = {
    pending: myOrders.filter(o => o.status === 'pending').length,
    cooking: myOrders.filter(o => o.status === 'cooking').length,
    ready: myOrders.filter(o => o.status === 'ready').length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/65 mb-1">Chef Station</p>
          <h1 className="text-3xl font-royal gold-text-gradient">Kitchen Command</h1>
        </div>
        <div className="flex items-center gap-3">
          {['all', 'mine'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all border
                ${filter === f
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'}`}
            >
              {f === 'all' ? 'All Orders' : 'My Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/8 border border-white/20 overflow-hidden"
          >
            <Bell className="text-white shrink-0" size={18} />
            <span className="text-sm text-gray-100">{alert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'Awaiting Prep', val: stats.pending, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
          { label: 'In Progress', val: stats.cooking, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
          { label: 'Ready to Serve', val: stats.ready, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`royal-glass p-5 rounded-2xl border ${s.border}`}
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-500">{s.label}</p>
            <h2 className={`text-4xl font-royal mt-2 ${s.color}`}>{s.val}</h2>
          </motion.div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <KanbanColumn
          title="Grand Preparation"
          icon={ChefHat}
          orders={myOrders.filter(o => o.status === 'pending')}
          status="pending"
          onAdvance={advanceStatus}
          color={{ iconBg: 'bg-white/10', icon: 'text-white', badge: 'text-white' }}
        />
        <KanbanColumn
          title="Active Culinary"
          icon={Flame}
          orders={myOrders.filter(o => o.status === 'cooking')}
          status="cooking"
          onAdvance={advanceStatus}
          color={{ iconBg: 'bg-white/10', icon: 'text-white', badge: 'text-white' }}
        />
        <KanbanColumn
          title="Ready for Service"
          icon={CheckCircle2}
          orders={myOrders.filter(o => o.status === 'ready')}
          status="ready"
          onAdvance={advanceStatus}
          color={{ iconBg: 'bg-white/10', icon: 'text-white', badge: 'text-white' }}
        />
      </div>
    </div>
  );
};

export default ChefDashboard;
