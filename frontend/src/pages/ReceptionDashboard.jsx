import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Table2, Clock, CheckCircle2, Circle,
  UserPlus, X, Utensils, RefreshCw, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useRestaurantStore from '../store/useRestaurantStore';
import useOrderStore from '../store/useOrderStore';
import useAuthStore from '../store/useAuthStore';

const TABLE_STATUS_CONFIG = {
  available: {
    label: 'Available',
    dot: 'bg-emerald-300',
    pill: 'bg-emerald-400/10 border-emerald-300/30 text-emerald-200 shadow-[0_0_18px_rgba(67,255,181,0.18)]',
    card: 'border-emerald-300/25',
  },
  occupied: {
    label: 'Occupied',
    dot: 'bg-rose-300',
    pill: 'bg-rose-400/10 border-rose-300/30 text-rose-200 shadow-[0_0_16px_rgba(255,95,136,0.22)]',
    card: 'border-rose-300/25',
  },
  reserved: {
    label: 'Reserved',
    dot: 'bg-sky-300',
    pill: 'bg-sky-400/10 border-sky-300/30 text-sky-200 shadow-[0_0_16px_rgba(91,201,255,0.2)]',
    card: 'border-sky-300/25',
  },
};

const ORDER_STATUS_PILLS = {
  pending: 'bg-yellow-400/10 text-yellow-200 border border-yellow-300/35 shadow-[0_0_14px_rgba(247,208,90,0.2)]',
  cooking: 'bg-orange-400/10 text-orange-200 border border-orange-300/35 shadow-[0_0_14px_rgba(255,164,72,0.2)]',
  ready: 'bg-emerald-400/10 text-emerald-200 border border-emerald-300/35 shadow-[0_0_14px_rgba(70,255,188,0.18)]',
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
          <h3 className="font-royal text-slate-100 text-xl">Seat at Table #{table.number}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2">Guest Name</label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && onSeat(table.id, name.trim())}
            placeholder="e.g. Rahul Verma"
            className="soft-input"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={!name.trim()}
          onClick={() => onSeat(table.id, name.trim())}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1f4b99] via-[#2277c8] to-[#26a6c0] text-slate-50 font-semibold tracking-[0.14em] text-sm
            shadow-[0_12px_28px_rgba(37,121,201,0.38)] disabled:opacity-40 transition-all"
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
      whileHover={{ y: -4, scale: 1.01 }}
      className={`royal-glass rounded-2xl p-4 border ${cfg.card} space-y-3 transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} ${table.status === 'occupied' ? 'animate-pulse' : ''}`} />
          <span className="font-royal text-slate-100 text-lg">T{table.number}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.pill}`}>
          <span className="text-[10px] uppercase tracking-wider">{cfg.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Users size={12} />
        <span>Cap: {table.capacity}</span>
        {table.customerName && (
          <>
            <span className="text-slate-700">•</span>
            <span className="text-slate-300 truncate">{table.customerName}</span>
          </>
        )}
      </div>

      {tableOrders.length > 0 && (
        <div className="space-y-1">
          {tableOrders.map(o => (
            <div key={o.id} className="flex items-center justify-between bg-white/[0.04] rounded-lg px-2 py-1.5">
              <span className="text-[10px] text-slate-300 truncate">{o.dish}</span>
              <span className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded-full ${ORDER_STATUS_PILLS[o.status]}`}>{o.status}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {table.status === 'available' && (
          <>
            <button
              onClick={() => onSeat(table)}
              title="Seat guest"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-400/12 border border-emerald-300/30 text-emerald-200 hover:bg-emerald-400/20 transition-all"
            >
              <UserPlus size={14} />
            </button>
            <button
              onClick={() => onReserve(table)}
              title="Reserve table"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-sky-400/12 border border-sky-300/30 text-sky-200 hover:bg-sky-400/20 transition-all"
            >
              <Circle size={14} />
            </button>
          </>
        )}
        {(table.status === 'occupied' || table.status === 'reserved') && (
          <button
            onClick={() => onClear(table.id)}
            title="Clear table"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-rose-400/12 border border-rose-300/30 text-rose-200 hover:bg-rose-400/20 transition-all"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ReceptionDashboard = () => {
  const { tables, seatCustomer, clearTable, reserveTable } = useRestaurantStore();
  const { orders } = useOrderStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Front of House</p>
          <h1 className="text-3xl font-royal text-slate-100">Reception Monitor</h1>
        </div>
        <div className="royal-glass rounded-2xl px-4 py-3 border border-white/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 to-slate-100 flex items-center justify-center text-slate-900 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'R'}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-100 font-medium truncate">{user?.name || 'Reception'}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Reception Desk</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 w-9 h-9 rounded-lg bg-white/8 border border-white/15 text-slate-200 hover:bg-white/14 transition-all flex items-center justify-center"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
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
                <p className="text-[10px] uppercase tracking-widest text-slate-500">{s.label}</p>
                <h2 className={`text-3xl font-royal ${s.color}`}>{s.val}</h2>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table Grid */}
      <div>
        <h2 className="text-sm font-royal text-slate-300 uppercase tracking-widest mb-4">Table Floor Plan</h2>
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
        <h2 className="text-sm font-royal text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Utensils size={14} className="text-cyan-200" /> Live Order Feed
        </h2>
        <div className="royal-glass rounded-3xl overflow-hidden border border-white/5">
          <div className="grid grid-cols-5 px-5 py-3 bg-white/[0.04] border-b border-white/10">
            {['Order ID', 'Table', 'Dish', 'Guest', 'Status'].map(h => (
              <span key={h} className="text-[10px] uppercase tracking-widest text-slate-500">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {recentOrders.length === 0 && (
              <div className="py-12 text-center text-slate-600 text-sm">No active orders</div>
            )}
            {recentOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-5 items-center px-5 py-3 transition-colors ${
                  i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                } hover:bg-white/[0.05]`}
              >
                <span className="text-[11px] font-mono text-slate-500">#{order.id}</span>
                <span className="font-royal text-slate-200 text-sm">T{order.tableNo}</span>
                <span className="text-[13px] text-slate-300 truncate pr-2">{order.dish}</span>
                <span className="text-xs text-slate-400 truncate pr-2">{order.customerName}</span>
                <span className={`inline-flex w-fit text-[11px] font-medium capitalize px-2.5 py-1 rounded-full ${ORDER_STATUS_PILLS[order.status]}`}>
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
