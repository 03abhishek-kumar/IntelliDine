import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Plus, Minus, X, CheckCircle2, Clock, Flame,
  ChefHat, Trash2, UtensilsCrossed, Search, Star, TrendingUp
} from 'lucide-react';
import useRestaurantStore from '../store/useRestaurantStore';
import useOrderStore from '../store/useOrderStore';
import useAuthStore from '../store/useAuthStore';

const TRACK_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'cooking', label: 'Being Prepared', icon: Flame },
  { key: 'ready', label: 'Ready to Serve', icon: CheckCircle2 },
];

const MenuCard = ({ item, onAdd }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="royal-glass rounded-2xl overflow-hidden group cursor-default"
  >
    <div className="relative h-32 bg-gradient-to-br from-royal-gold/10 via-white/5 to-transparent flex items-center justify-center">
      <span className="text-5xl">{item.emoji}</span>
      {!item.available && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-xs text-gray-400 uppercase tracking-widest">Unavailable</span>
        </div>
      )}
      <span className="absolute top-3 right-3 text-[10px] bg-royal-gold/20 border border-royal-gold/30 text-royal-gold px-2 py-0.5 rounded-full uppercase tracking-wider">
        {item.type}
      </span>
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className="font-royal text-sm gold-text-gradient leading-tight">{item.name}</h3>
        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-royal-gold font-royal text-base">₹{item.price}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={!item.available}
          onClick={() => onAdd(item)}
          className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold-glow
            disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-gold-glow-strong transition-all"
        >
          <Plus size={16} className="text-royal-black" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const CustomerDashboard = () => {
  const { menuItems, categories, getMenuByCategory } = useRestaurantStore();
  const { addOrder, customerOrders } = useOrderStore();
  const { user } = useAuthStore();

  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [tableNo, setTableNo] = useState('');
  const [showTracker, setShowTracker] = useState(false);

  const filteredItems = getMenuByCategory(activeCategory).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = () => {
    if (!tableNo || cart.length === 0) return;
    const itemNames = cart.map(c => `${c.name}${c.qty > 1 ? ` x${c.qty}` : ''}`);
    addOrder({
      dish: cart[0].name + (cart.length > 1 ? ` +${cart.length - 1} more` : ''),
      chef: 'Chef Ahmed',
      chefId: 'chef@intellidine.com',
      type: cart[0].type || 'Classic',
      tableNo: Number(tableNo),
      customerName: user?.name || 'Guest',
      items: itemNames,
      totalAmount: cartTotal,
    });
    setOrderPlaced(true);
    setCart([]);
    setCartOpen(false);
    setShowTracker(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  // Use live order tracking from store
  const myOrders = customerOrders;
  const latestOrder = myOrders[myOrders.length - 1];

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-black via-royal-black/70 to-transparent" />
        <div className="relative p-8 h-full flex flex-col justify-end">
          <p className="text-royal-gold/70 text-xs tracking-widest uppercase mb-1">Welcome, {user?.name}</p>
          <h1 className="font-royal text-4xl gold-text-gradient">Royal Feasts Await</h1>
          <p className="text-gray-400 text-sm mt-1">Explore our curated menu of heritage recipes</p>
        </div>
      </div>

      <div className="p-6 space-y-7">
        {/* Order Tracker */}
        <AnimatePresence>
          {showTracker && latestOrder && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="royal-glass rounded-2xl p-5 border border-royal-gold/20 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-royal text-royal-gold text-sm tracking-widest uppercase">Live Order Tracker</h3>
                <button onClick={() => setShowTracker(false)} className="text-gray-600 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <p className="text-xs text-gray-400 mb-4">Table #{latestOrder.tableNo} • {latestOrder.dish}</p>
              <div className="flex items-center gap-2">
                {TRACK_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const stepIndex = TRACK_STEPS.findIndex(s => s.key === latestOrder.status);
                  const done = i <= stepIndex;
                  const active = i === stepIndex;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-1.5 flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                          ${active ? 'border-royal-gold bg-royal-gold/20 shadow-gold-glow' : done ? 'border-royal-gold/40 bg-royal-gold/10' : 'border-white/10 bg-white/5'}`}>
                          <Icon size={16} className={done ? 'text-royal-gold' : 'text-gray-600'} />
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider text-center ${done ? 'text-royal-gold' : 'text-gray-600'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < TRACK_STEPS.length - 1 && (
                        <div className={`flex-1 h-px mb-5 transition-all ${done && i < stepIndex ? 'bg-royal-gold/40' : 'bg-white/10'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Success Toast */}
        <AnimatePresence>
          {orderPlaced && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm text-emerald-300">Order placed! Your feast is being prepared.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-gray-200 text-sm
              focus:outline-none focus:border-royal-gold/50 transition-all placeholder-gray-600"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all border
                ${activeCategory === cat
                  ? 'border-royal-gold bg-royal-gold/10 text-royal-gold shadow-gold-glow'
                  : 'border-white/10 text-gray-500 hover:text-royal-gold hover:border-royal-gold/30'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map(item => (
            <MenuCard key={item.id} item={item} onAdd={addToCart} />
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-600">
              <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No dishes found</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && !cartOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setCartOpen(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-4 rounded-full
              bg-gold-gradient text-royal-black font-royal tracking-widest text-sm shadow-gold-glow-strong z-40"
          >
            <ShoppingCart size={18} />
            View Cart ({cartCount} items · ₹{cartTotal})
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm royal-glass border-l border-royal-gold/20 z-50 flex flex-col"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-royal text-royal-gold text-xl tracking-wider">Your Cart</h2>
                <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 && (
                  <div className="text-center py-16 text-gray-600">
                    <ShoppingCart size={36} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Your cart is empty</p>
                  </div>
                )}
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 font-medium truncate">{item.name}</p>
                      <p className="text-xs text-royal-gold">₹{item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Minus size={12} className="text-gray-300" />
                      </button>
                      <span className="text-sm text-gray-200 w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Plus size={12} className="text-gray-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-white/5 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2">Table Number</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={tableNo}
                    onChange={e => setTableNo(e.target.value)}
                    placeholder="1 – 12"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-200 text-sm
                      focus:outline-none focus:border-royal-gold/50 transition-all"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="font-royal text-royal-gold text-xl">₹{cartTotal}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={cart.length === 0 || !tableNo}
                  onClick={placeOrder}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-royal-black font-royal tracking-widest text-sm
                    shadow-gold-glow disabled:opacity-40 transition-all"
                >
                  Place Royal Order
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerDashboard;
