import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import { LogOut } from 'lucide-react';

const CustomerMenu = () => {
  const { user, logout } = useAuthStore();
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes').then(res => setDishes(res.data)).catch(err => console.error(err));
  }, []);

  const addToCart = (dishId) => {
    setCart(prev => {
      const existing = prev.find(item => item.dishId === dishId);
      if (existing) {
        return prev.map(item => item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { dishId, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        items: cart,
        customerId: user._id,
        priority: 'medium'
      });
      setOrderStatus('Order Placed Successfully! Your items will be prepared based on dynamic kitchen load.');
      setCart([]);
    } catch (err) {
      setOrderStatus('Order Failed. ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-royal gold-text-gradient">Royal Menu</h1>
        <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
           <LogOut size={16} /> Logout
        </button>
      </div>

      {orderStatus && (
        <div className="mb-6 p-4 bg-royal-gold/10 border border-royal-gold/50 text-royal-gold rounded-xl">
          {orderStatus}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dishes.map(dish => (
          <motion.div key={dish._id} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl royal-glass relative overflow-hidden">
             {/* Image placeholder */}
             <div className="h-40 bg-black/40 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-gray-600 font-playfair italic">Image of {dish.name}</span>
             </div>
             <p className="text-xs uppercase tracking-widest text-royal-gold mb-1">{dish.type}</p>
             <h3 className="text-2xl font-bold font-royal mb-2">{dish.name}</h3>
             <p className="text-sm text-gray-400 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
               Requires: {dish.ingredients.map(i => i.ingredientId.name).join(', ')}
             </p>
             <div className="flex justify-between items-center mt-6">
                <span className="text-lg font-mono">${dish.price}</span>
                <button 
                  onClick={() => addToCart(dish._id)}
                  className="px-4 py-2 rounded-lg bg-royal-gold text-black uppercase text-xs tracking-widest font-bold hover:bg-white transition"
                >
                  Add to Feast
                </button>
             </div>
          </motion.div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-10 inset-x-0 mx-auto w-[600px] bg-royal-black/90 border border-royal-gold/30 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl text-royal-gold font-royal mb-4 tracking-widest uppercase">Current Feast</h2>
          <div className="flex flex-wrap gap-4 mb-4">
             {cart.map(item => {
               const d = dishes.find(x => x._id === item.dishId);
               return <span key={item.dishId} className="px-3 py-1 bg-white/10 rounded-full text-sm">{d?.name} x{item.quantity}</span>
             })}
          </div>
          <button 
             onClick={placeOrder}
             className="w-full p-4 bg-gold-gradient rounded-xl text-black uppercase tracking-widest font-bold shadow-gold-glow"
          >
             Confirm Royal Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
