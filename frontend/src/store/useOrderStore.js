import { create } from 'zustand';
import axios from 'axios';

const useOrderStore = create((set, get) => ({
  orders: [],
  alert: null,
  
  fetchOrders: async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      set({ orders: res.data });
      // Calculate high load based on pending prep times if we want, or just wait for backend alert
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },

  injectOrder: (newOrder) => set((state) => {
    // Problem 2 Priority is handled by backend returning sorted list, but for live insert:
    // Simply push it and re-fetch to get correct backend sorted state, or just unshift for now
    // Actually best to re-fetch quickly or just push because next fetch fixes sort
    return { orders: [...state.orders.filter(o => o._id !== newOrder._id), newOrder] };
  }),

  injectDeletedOrder: (orderId) => set((state) => ({
    orders: state.orders.filter(o => o._id !== orderId)
  })),

  advanceStatus: async (orderId, currentStatus) => {
    const statusMap = {
      'pending': 'cooking',
      'cooking': 'ready',
      'ready': 'done' // Usually done is removed from active board
    };
    
    // Optimistic UI update
    const previousOrders = get().orders;
    set(state => ({
       orders: state.orders.map(order => 
         order._id === orderId ? { ...order, status: statusMap[currentStatus] } : order
       )
    }));

    try {
      if (statusMap[currentStatus] === 'done') {
         await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
      } else {
         await axios.patch(`http://localhost:5000/api/orders/${orderId}`, { status: statusMap[currentStatus] });
      }
    } catch (err) {
      console.error("Failed to advance status:", err);
      // Revert optimistic update on failure
      set({ orders: previousOrders });
    }
  },

  getStats: () => {
    const orders = get().orders;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      cooking: orders.filter(o => o.status === 'cooking').length,
      ready: orders.filter(o => o.status === 'ready').length,
    }
  }
}));

export default useOrderStore;
