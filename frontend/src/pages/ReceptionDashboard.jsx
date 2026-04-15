import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';

const ReceptionDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Initial Fetch
    axios.get('http://localhost:5000/api/ingredients').then(res => setInventory(res.data));
    axios.get('http://localhost:5000/api/ingredients/low-stock').then(res => setAlerts(res.data));

    const socket = io('http://localhost:5000');
    
    // Live update on new orders depleting stock
    socket.on('inventory_alert', (newAlerts) => {
      setAlerts(prev => {
        const merged = [...newAlerts, ...prev];
        // simple unique by name
        return Array.from(new Map(merged.map(item => [item.name, item])).values());
      });
      // Refresh full inventory to see new numbers
      axios.get('http://localhost:5000/api/ingredients').then(res => setInventory(res.data));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-royal text-royal-gold mb-8">Reception Operations Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Alerts (Problem Statement 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <AlertTriangle size={120} />
            </div>
            <h2 className="text-xl font-bold text-red-400 font-royal tracking-widest uppercase mb-6 flex items-center gap-2">
              <AlertTriangle size={20} />
              Critical Shortages
            </h2>
            
            <AnimatePresence>
              {alerts.length === 0 ? (
                <p className="text-gray-400">All stock levels nominal.</p>
              ) : (
                alerts.map(item => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="p-4 mb-4 bg-red-500/20 rounded-xl border border-red-500/40"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-red-300">{item.name}</span>
                      <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full uppercase">Restock Req.</span>
                    </div>
                    <p className="text-sm text-red-200/80 mt-1">Available: {item.quantity || item.remaining} / Min: {item.threshold}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Col: Full Inventory Tracker */}
        <div className="lg:col-span-2">
          <div className="royal-glass p-8 rounded-3xl">
            <h2 className="text-xl font-royal text-royal-gold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package size={20} />
              Live Inventory Ledger
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 uppercase tracking-wider text-xs">
                    <th className="pb-4 pt-2">Ingredient</th>
                    <th className="pb-4 pt-2">Status</th>
                    <th className="pb-4 pt-2 text-right">Available Qty</th>
                    <th className="pb-4 pt-2 text-right">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => {
                    const isLow = item.quantity < item.threshold;
                    return (
                      <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-4 font-medium text-gray-200">{item.name}</td>
                        <td className="py-4">
                          {isLow ? <span className="text-red-400 flex items-center gap-1 text-xs"><TrendingDown size={14}/> LOW</span> 
                                 : <span className="text-emerald-400 text-xs">NOMINAL</span>}
                        </td>
                        <td className="py-4 text-right font-mono text-gray-300">{item.quantity}</td>
                        <td className="py-4 text-right text-gray-500 text-xs">{item.unit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
