import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MonitorDot, Users, Table2, Clock, CheckCircle2, Circle,
  UserPlus, X, TrendingUp, Utensils, RefreshCw
} from 'lucide-react';
import useRestaurantStore from '../store/useRestaurantStore';
import useOrderStore from '../store/useOrderStore';

const TABLE_STATUS_CONFIG = {
  available: { label: 'Available', color: 'text-white', bg: 'bg-white/10', border: 'border-white/25', dot: 'bg-white' },
  occupied:  { label: 'Occupied',  color: 'text-white', bg: 'bg-white/10', border: 'border-white/25', dot: 'bg-white' },
  reserved:  { label: 'Reserved',  color: 'text-white', bg: 'bg-white/10', border: 'border-white/25', dot: 'bg-white' },
};

const ORDER_STATUS_COLORS = {
  pending: 'text-white',
  cooking: 'text-white',
  ready: 'text-white',
};

const SeatModal = ({ table, onClose, onSeat }) => {
  const [name, setName] = useState('');
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="royal-glass rounded-3xl p-8 w-full max-w-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-royal text-white text-xl">Seat at Table #{table.number}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Guest Name</label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && onSeat(table.id, name.trim())}
            placeholder="e.g. Rahul Verma"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-200 text-sm
              focus:outline-none focus:border-white/40 transition-all"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={!name.trim()}
          onClick={() => onSeat(table.id, name.trim())}
          className="w-full py-3 rounded-xl bg-white text-black font-royal tracking-widest text-sm
            shadow-gold-glow disabled:opacity-40 transition-all"
        >
          Confirm Seating
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const TableCard = ({ table, orders, onSeat, onClear, onReserve }) => {
  const cfg = TABLE_STATUS_CONFIG[table.status];
  const tableOrders = orders.filter(o => o.tableNo === table.number);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`royal-glass rounded-2xl p-4 border ${cfg.border} space-y-3 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} ${table.status === 'occupied' ? 'animate-pulse' : ''}`} />
          <span className="font-royal text-white text-lg">T{table.number}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${cfg.bg} border ${cfg.border}`}>
          <span className={`text-[10px] uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Users size={12} />
        <span>Cap: {table.capacity}</span>
        {table.customerName && (
          <>
            <span className="text-gray-700">•</span>
            <span className="text-gray-300 truncate">{table.customerName}</span>
          </>
        )}
      </div>

      {tableOrders.length > 0 && (
        <div className="space-y-1">
          {tableOrders.map(o => (
            <div key={o.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-2 py-1">
              <span className="text-[10px] text-gray-400 truncate">{o.dish}</span>
              <span className={`text-[10px] font-medium ${ORDER_STATUS_COLORS[o.status]}`}>{o.status}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        {table.status === 'available' && (
          <>
            <button
              onClick={() => onSeat(table)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/10 border border-white/20
                text-white text-[10px] uppercase tracking-wider hover:bg-white/20 transition-all"
            >
              <UserPlus size={12} /> Seat
            </button>
            <button
              onClick={() => onReserve(table)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/10 border border-white/20
                text-white text-[10px] uppercase tracking-wider hover:bg-white/20 transition-all"
            >
              <Circle size={12} /> Reserve
            </button>
          </>
        )}
        {(table.status === 'occupied' || table.status === 'reserved') && (
          <button
            onClick={() => onClear(table.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/10 border border-white/20
              text-white text-[10px] uppercase tracking-wider hover:bg-white/20 transition-all"
          >
            <RefreshCw size={12} /> Clear
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ReceptionDashboard = () => {
  const { tables, seatCustomer, clearTable, reserveTable } = useRestaurantStore();
  const { orders } = useOrderStore();
  const [seatModal, setSeatModal] = useState(null);
  const [reserveModal, setReserveModal] = useState(null);

  const available = tables.filter(t => t.status === 'available').length;
  const occupied = tables.filter(t => t.status === 'occupied').length;
  const reserved = tables.filter(t => t.status === 'reserved').length;

  const recentOrders = [...orders].reverse().slice(0, 10);

  const handleSeat = (tableId, name) => {
    seatCustomer(tableId, name);
    setSeatModal(null);
  };

  const handleReserve = (tableId, name) => {
    reserveTable(tableId, name);
    setReserveModal(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-royal-gold/60 mb-1">Front of House</p>
        <h1 className="text-3xl font-royal gold-text-gradient">Reception Monitor</h1>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Tables', val: tables.length, color: 'text-royal-gold', border: 'border-royal-gold/20', icon: Table2 },
          { label: 'Available', val: available, color: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
          { label: 'Occupied', val: occupied, color: 'text-amber-400', border: 'border-amber-500/20', icon: Users },
          { label: 'Reserved', val: reserved, color: 'text-purple-400', border: 'border-purple-500/20', icon: Clock },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`royal-glass p-5 rounded-2xl border ${s.border} flex items-center gap-4`}
            >
              <div className={`p-2.5 rounded-xl bg-white/5`}>
                <Icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">{s.label}</p>
                <h2 className={`text-3xl font-royal ${s.color}`}>{s.val}</h2>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Grid */}
      <div>
        <h2 className="text-sm font-royal text-royal-gold/70 uppercase tracking-widest mb-4">Table Floor Plan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              orders={orders}
              onSeat={(t) => setSeatModal(t)}
              onClear={clearTable}
              onReserve={(t) => setReserveModal(t)}
            />
          ))}
        </div>
      </div>

      {/* Live Orders Monitor */}
      <div>
        <h2 className="text-sm font-royal text-royal-gold/70 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Utensils size={14} className="text-royal-gold" /> Live Order Feed
        </h2>
        <div className="royal-glass rounded-3xl overflow-hidden border border-white/5">
          <div className="grid grid-cols-5 px-5 py-3 bg-white/[0.03] border-b border-white/5">
            {['Order ID', 'Table', 'Dish', 'Guest', 'Status'].map(h => (
              <span key={h} className="text-[10px] uppercase tracking-widest text-gray-600">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.length === 0 && (
              <div className="py-12 text-center text-gray-700 text-sm">No active orders</div>
            )}
            {recentOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-5 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs font-mono text-gray-500">#{order.id}</span>
                <span className="font-royal text-royal-gold text-sm">T{order.tableNo}</span>
                <span className="text-sm text-gray-300 truncate pr-2">{order.dish}</span>
                <span className="text-xs text-gray-400 truncate pr-2">{order.customerName}</span>
                <span className={`text-xs font-medium capitalize ${ORDER_STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {seatModal && (
          <SeatModal
            table={seatModal}
            onClose={() => setSeatModal(null)}
            onSeat={handleSeat}
          />
        )}
        {reserveModal && (
          <SeatModal
            table={reserveModal}
            onClose={() => setReserveModal(null)}
            onSeat={handleReserve}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReceptionDashboard;
