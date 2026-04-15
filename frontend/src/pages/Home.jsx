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

    <div className="flex flex-col gap-4 min-h-[500px] p-2 rounded-3xl bg-white/[0.02] border border-white/5">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <RoyalCard key={order._id} order={order} onAdvance={onAdvance} />
        ))}
      </AnimatePresence>
      
      {orders.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl">
          <Icon size={40} className="mb-2 opacity-10" />
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
    <div className="flex-1 overflow-y-auto p-6 space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[250px] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-royal-black via-royal-black/80 to-transparent"></div>
        <div className="absolute bottom-8 left-12 space-y-2 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-royal gold-text-gradient"
          >
            Chef Station
          </motion.h1>
          <motion.p className="text-gray-400 italic text-sm leading-relaxed font-playfair">
            Real-time kitchen load optimization and smart queue prioritization active.
          </motion.p>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Queue', val: stats.total, color: 'text-royal-gold' },
          { label: 'Pending Prioritization', val: stats.pending, color: 'text-amber-500' },
          { label: 'In Kitchen', val: stats.cooking, color: 'text-blue-500' },
          { label: 'Ready for Service', val: stats.ready, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="royal-glass p-6 rounded-3xl group cursor-default"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-royal-gold transition-colors">
              {stat.label}
            </p>
            <h2 className={`text-3xl font-royal mt-2 ${stat.color}`}>
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
