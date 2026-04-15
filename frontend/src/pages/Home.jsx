import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useOrderStore from '../store/useOrderStore';
import RoyalCard from '../components/RoyalCard';
import { ChefHat, Flame, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';

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
          <RoyalCard key={order.id} order={order} onAdvance={onAdvance} />
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
  const { orders, advanceStatus, alert } = useOrderStore();
  const stats = useOrderStore.getState().getStats();

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const cookingOrders = orders.filter(o => o.status === 'cooking');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-royal-black via-royal-black/40 to-transparent"></div>
        
        <div className="absolute bottom-12 left-12 space-y-4 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="h-1 w-12 bg-royal-gold"></div>
            <span className="text-royal-gold font-medium tracking-[0.3em] uppercase text-xs">
              Culinary Command Center
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-royal gold-text-gradient"
          >
            The Royal Legacy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 italic text-lg leading-relaxed font-playfair"
          >
            "From the afsaanvi lands of IntelliDine emerges a naayab dastoor, prepared for azeem-o-shaan gatherings. Crafted with royal precision, where every detail is treated with sabr and nazakat."
          </motion.p>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 right-12 text-royal-gold cursor-pointer"
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
            <div className="flex items-center gap-4 p-4 royal-glass border-amber-500/50 rounded-2xl bg-amber-500/10">
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertTriangle size={20} className="text-royal-black" />
              </div>
              <div>
                <h4 className="font-royal text-amber-500 tracking-wider">HIGH KITCHEN LOAD</h4>
                <p className="text-sm text-amber-500/80">{alert}</p>
              </div>
              <div className="ml-auto px-4 py-1.5 rounded-full border border-amber-500/30 text-xs text-amber-500 uppercase tracking-widest">
                Optimizing Flow
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Feasts', val: stats.total, color: 'text-royal-gold' },
          { label: 'In Preparation', val: stats.pending, color: 'text-amber-500' },
          { label: 'Sautéing', val: stats.cooking, color: 'text-blue-500' },
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
          title="Grand Preparation" 
          icon={ChefHat} 
          orders={pendingOrders} 
          onAdvance={advanceStatus}
        />
        <DashboardColumn 
          title="Active Culinary" 
          icon={Flame} 
          orders={cookingOrders} 
          onAdvance={advanceStatus}
        />
        <DashboardColumn 
          title="Ready to Serve" 
          icon={CheckCircle2} 
          orders={readyOrders} 
          onAdvance={advanceStatus}
        />
      </div>
    </div>
  );
};

export default Home;
