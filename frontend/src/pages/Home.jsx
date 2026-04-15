import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useOrderStore from '../store/useOrderStore';
import RoyalCard from '../components/RoyalCard';
import { ChefHat, Flame, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';
import { io } from 'socket.io-client';

const DashboardColumn = ({ title, icon: Icon, orders, onAdvance }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-royal-gold/10 border border-royal-gold/20">
          <Icon className="text-royal-gold" size={18} />
        </div>
        <h2 className="text-sm font-royal tracking-widest uppercase text-royal-gold/80">
          {title}
        </h2>
      </div>
      <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-gray-500 font-mono">
        {orders.length}
      </span>
    </div>

    <div className="flex flex-col gap-4 p-2 rounded-2xl bg-white/[0.03] border border-white/10">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <RoyalCard key={order._id} order={order} onAdvance={onAdvance} />
        ))}
      </AnimatePresence>
      
      {orders.length === 0 && (
        <div className="h-36 flex flex-col items-center justify-center text-gray-600 border border-dashed border-white/10 rounded-2xl">
          <Icon size={32} className="mb-2 opacity-20" />
          <p className="text-xs uppercase tracking-widest">Station Empty</p>
        </div>
      )}
    </div>
  </div>
);

const Home = () => {
  const { orders, fetchOrders, advanceStatus, alert, injectOrder, injectDeletedOrder } = useOrderStore();
  const stats = useOrderStore.getState().getStats();

  useEffect(() => {
    fetchOrders(); // load initial

    const socket = io('http://localhost:5000');
    
    socket.on('new_order', (order) => {
       fetchOrders(); // Easiest way to maintain sorted Priority logic from Problem 2
    });

    socket.on('order_updated', (updatedOrder) => {
       fetchOrders();
    });

    socket.on('order_deleted', (id) => {
       injectDeletedOrder(id);
    });

    return () => socket.disconnect();
  }, [fetchOrders, injectDeletedOrder]);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const cookingOrders = orders.filter(o => o.status === 'cooking');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 pb-20">
      {/* Hero Section */}
      <section className="relative h-[320px] md:h-[360px] w-full rounded-[2rem] overflow-hidden group border border-white/10 shadow-[0_20px_60px_rgba(2,4,12,0.7)]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="absolute bottom-10 left-8 md:left-12 space-y-3 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-1 w-10 bg-white/80"></div>
            <span className="text-white/85 font-medium tracking-[0.24em] uppercase text-[11px]">
              Kitchen Control
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight text-white"
          >
            Coding Unbound,
            <span className="text-white/80"> Service at Speed</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl"
          >
            Keep orders, preparation, and serving in one clean operational workspace with real-time updates.
          </motion.p>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 right-8 md:right-12 text-white/75 cursor-pointer"
        >
          <ArrowDown size={32} />
        </motion.div>
      </section>

      {/* Alert System */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 royal-glass border-white/20 rounded-2xl bg-white/8">
              <div className="p-2 bg-white rounded-lg">
                <AlertTriangle size={20} className="text-black" />
              </div>
              <div>
                <h4 className="font-royal text-white tracking-wider">HIGH KITCHEN LOAD</h4>
                <p className="text-sm text-gray-300">{alert}</p>
              </div>
              <div className="ml-auto px-4 py-1.5 rounded-full border border-white/20 text-xs text-white uppercase tracking-widest">
                Optimizing Flow
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Feasts', val: stats.total, color: 'text-white' },
          { label: 'In Preparation', val: stats.pending, color: 'text-white' },
          { label: 'Sautéing', val: stats.cooking, color: 'text-white' },
          { label: 'Ready for Service', val: stats.ready, color: 'text-white' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="royal-glass p-5 rounded-2xl group cursor-default border-white/15"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
              {stat.label}
            </p>
            <h2 className={`text-3xl font-semibold mt-2 ${stat.color}`}>
              {stat.val}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DashboardColumn 
          title="Smart Queue (Pending)" 
          icon={ChefHat} 
          orders={pendingOrders} 
          onAdvance={advanceStatus}
        />
        <DashboardColumn 
          title="Cooking Pipeline" 
          icon={Flame} 
          orders={cookingOrders} 
          onAdvance={advanceStatus}
        />
        <DashboardColumn 
          title="Service Queue" 
          icon={CheckCircle2} 
          orders={readyOrders} 
          onAdvance={advanceStatus}
        />
      </div>
    </div>
  );
};

export default Home;
