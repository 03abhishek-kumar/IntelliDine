import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, IndianRupee, ShoppingBag, Clock, Users, Plus,
  Trash2, ToggleLeft, ToggleRight, ChefHat, Star, BarChart3, X, Package
} from 'lucide-react';
import useRestaurantStore from '../store/useRestaurantStore';
import useOrderStore from '../store/useOrderStore';

const TABS = ['Overview', 'Menu Management', 'Staff'];

const STAFF = [
  { name: 'Chef Ahmed', role: 'Head Chef', email: 'chef@intellidine.com', status: 'active', orders: 18 },
  { name: 'Chef Sana', role: 'Sous Chef', email: 'chef2@intellidine.com', status: 'active', orders: 14 },
  { name: 'Priya Kapoor', role: 'Receptionist', email: 'reception@intellidine.com', status: 'active', orders: null },
];

const AddItemModal = ({ onClose, onAdd }) => {
  const { categories } = useRestaurantStore();
  const [form, setForm] = useState({ name: '', price: '', category: 'Mains', type: 'Classic', description: '', emoji: '🍽️' });
  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="royal-glass rounded-3xl p-8 w-full max-w-md space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-royal text-royal-gold text-xl">Add Menu Item</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        {[
          { label: 'Dish Name', key: 'name', type: 'text', placeholder: 'e.g. Murgh Musallam' },
          { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '0' },
          { label: 'Emoji Icon', key: 'emoji', type: 'text', placeholder: '🍽️' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => handle(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 text-sm
                focus:outline-none focus:border-royal-gold/50 transition-all"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => handle('category', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-gray-200 text-sm
                focus:outline-none focus:border-royal-gold/50 transition-all"
            >
              {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Type</label>
            <select
              value={form.type}
              onChange={e => handle('type', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-gray-200 text-sm
                focus:outline-none focus:border-royal-gold/50"
            >
              {['Classic', 'Premium', 'Signature', 'Dessert'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={e => handle('description', e.target.value)}
            placeholder="Brief description of the dish..."
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 text-sm
              focus:outline-none focus:border-white/40 transition-all resize-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={!form.name || !form.price}
          onClick={() => { onAdd({ ...form, price: Number(form.price) }); onClose(); }}
          className="w-full py-3.5 rounded-xl bg-white text-black font-royal tracking-widest text-sm
            shadow-gold-glow disabled:opacity-40 transition-all"
        >
          Add to Menu
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const OwnerDashboard = () => {
  const { menuItems, toggleItemAvailability, addMenuItem, removeMenuItem } = useRestaurantStore();
  const { getRevenueStats, orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [catFilter, setCatFilter] = useState('All');

  const revenue = getRevenueStats();
  const { categories } = useRestaurantStore();

  const filteredItems = catFilter === 'All' ? menuItems : menuItems.filter(i => i.category === catFilter);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-royal-gold/60 mb-1">Management Console</p>
        <h1 className="text-3xl font-royal gold-text-gradient">Owner Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium tracking-wide transition-all border-b-2 -mb-px
              ${activeTab === tab
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div className="space-y-8">
          {/* Revenue Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Today's Revenue", val: `₹${revenue.todayRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-white', border: 'border-white/20', iconBg: 'bg-white/10' },
              { label: 'Week Revenue', val: `₹${(revenue.weekRevenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-white', border: 'border-white/20', iconBg: 'bg-white/10' },
              { label: "Today's Orders", val: revenue.totalOrdersToday, icon: ShoppingBag, color: 'text-white', border: 'border-white/20', iconBg: 'bg-white/10' },
              { label: 'Avg Order Value', val: `₹${revenue.avgOrderValue}`, icon: BarChart3, color: 'text-white', border: 'border-white/20', iconBg: 'bg-white/10' },
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
                  <div className={`p-3 rounded-xl ${s.iconBg}`}>
                    <Icon size={20} className={s.color} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{s.label}</p>
                    <h2 className={`text-2xl font-royal mt-0.5 ${s.color}`}>{s.val}</h2>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Live Orders Summary */}
          <div className="royal-glass rounded-3xl p-6 border border-white/5">
            <h3 className="font-royal text-white tracking-widest text-sm uppercase mb-5">Active Orders</h3>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Package size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">No active orders</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-royal text-white text-sm">T{order.tableNo}</span>
                      <div>
                        <p className="text-sm text-gray-200">{order.dish}</p>
                        <p className="text-xs text-gray-500">{order.customerName} · {order.chef}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white font-medium">₹{order.totalAmount}</span>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider
                        bg-white/10 text-white border border-white/20`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === 'Menu Management' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all border
                    ${catFilter === cat
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-medium text-sm shadow-gold-glow whitespace-nowrap"
            >
              <Plus size={16} /> Add Item
            </motion.button>
          </div>

          <div className="royal-glass rounded-3xl overflow-hidden border border-white/5">
            <div className="grid grid-cols-6 px-5 py-3 bg-white/[0.03] border-b border-white/5">
              {['Item', 'Category', 'Type', 'Price', 'Status', 'Actions'].map(h => (
                <span key={h} className="text-[10px] uppercase tracking-widest text-gray-600">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-white/5">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-6 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <span className="text-lg">{item.emoji}</span>
                    )}
                    <span className="text-sm text-gray-200 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.category}</span>
                  <span className="text-xs text-gray-500">{item.type}</span>
                  <span className="text-sm font-royal text-white">₹{item.price}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-white' : 'bg-gray-500'}`} />
                    <span className={`text-[10px] uppercase tracking-wider ${item.available ? 'text-white' : 'text-gray-400'}`}>
                      {item.available ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className="text-gray-500 hover:text-white transition-colors"
                      title="Toggle availability"
                    >
                      {item.available ? <ToggleRight size={18} className="text-white" /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => removeMenuItem(item.id)}
                      className="text-gray-600 hover:text-white transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'Staff' && (
        <div className="space-y-5">
          {STAFF.map((staff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="royal-glass rounded-2xl p-5 border border-white/5 flex items-center gap-5"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-gold-glow shrink-0">
                <span className="font-royal text-black text-lg">{staff.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-royal text-white">{staff.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{staff.role} · {staff.email}</p>
              </div>
              {staff.orders !== null && (
                <div className="text-right">
                  <p className="text-2xl font-royal text-white">{staff.orders}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Orders Today</p>
                </div>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Active
              </span>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={addMenuItem} />}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;
