import { create } from 'zustand'

const INITIAL_ORDERS = [
  { id: '1', dish: 'Subz-e-Biryani', chef: 'Chef Ahmed', status: 'pending', time: '12:40 PM', type: 'Signature' },
  { id: '2', dish: 'Murgh-e-Khaas', chef: 'Chef Sana', status: 'cooking', time: '12:42 PM', type: 'Premium' },
  { id: '3', dish: 'Zaikedaar Paneer', chef: 'Chef Kabir', status: 'cooking', time: '12:45 PM', type: 'Classic' },
  { id: '4', dish: 'Dum Gosht', chef: 'Chef Ahmed', status: 'ready', time: '12:35 PM', type: 'Signature' },
  { id: '5', dish: 'Noorani Kheer', chef: 'Chef Sana', status: 'pending', time: '12:50 PM', type: 'Dessert' },
]

const useOrderStore = create((set) => ({
  orders: INITIAL_ORDERS,
  alert: null,
  
  addOrder: (newOrder) => set((state) => {
    const updatedOrders = [...state.orders, newOrder];
    return { 
      orders: updatedOrders,
      alert: updatedOrders.length > 6 ? 'High Load — Delay Expected' : null
    };
  }),

  advanceStatus: (orderId) => set((state) => {
    const statusMap = {
      'pending': 'cooking',
      'cooking': 'ready',
      'ready': 'completed'
    };

    const updatedOrders = state.orders.map(order => 
      order.id === orderId ? { ...order, status: statusMap[order.status] } : order
    ).filter(order => order.status !== 'completed');

    return { 
      orders: updatedOrders,
      alert: updatedOrders.length > 6 ? 'High Load — Delay Expected' : null
    };
  }),

  getStats: () => {
    const orders = useOrderStore.getState().orders;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      cooking: orders.filter(o => o.status === 'cooking').length,
      ready: orders.filter(o => o.status === 'ready').length,
    }
  }
}))

export default useOrderStore
