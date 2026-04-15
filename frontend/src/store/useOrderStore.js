import { create } from 'zustand';

let nextId = 10;

const INITIAL_ORDERS = [
  { id: '1', dish: 'Murgh-e-Khaas', chef: 'Chef Ahmed', status: 'cooking', time: '1:10 PM', type: 'Premium', tableNo: 3, customerName: 'Ravi Gupta', items: ['Murgh-e-Khaas', 'Garlic Kulcha'], totalAmount: 600, chefId: 'chef@intellidine.com' },
  { id: '2', dish: 'Mutton Biryani', chef: 'Chef Sana', status: 'pending', time: '1:15 PM', type: 'Signature', tableNo: 9, customerName: 'Anjali Mehta', items: ['Mutton Biryani', 'Mango Lassi'], totalAmount: 679, chefId: 'chef2@intellidine.com' },
  { id: '3', dish: 'Dal Makhani', chef: 'Chef Ahmed', status: 'ready', time: '1:05 PM', type: 'Classic', tableNo: 3, customerName: 'Ravi Gupta', items: ['Dal Makhani', 'Keema Naan'], totalAmount: 400, chefId: 'chef@intellidine.com' },
  { id: '4', dish: 'Paneer Tikka', chef: 'Chef Sana', status: 'pending', time: '1:20 PM', type: 'Classic', tableNo: 9, customerName: 'Anjali Mehta', items: ['Paneer Tikka', 'Royal Shirazi'], totalAmount: 440, chefId: 'chef2@intellidine.com' },
  { id: '5', dish: 'Seekh Kebab', chef: 'Chef Ahmed', status: 'cooking', time: '1:08 PM', type: 'Premium', tableNo: 3, customerName: 'Ravi Gupta', items: ['Seekh Kebab'], totalAmount: 380, chefId: 'chef@intellidine.com' },
];

const useOrderStore = create((set, get) => ({
  orders: INITIAL_ORDERS,
  alert: null,
  customerOrders: [], // orders placed by current customer in this session

  addOrder: (orderData) => set((state) => {
    const newOrder = {
      id: String(++nextId),
      ...orderData,
      status: 'pending',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updatedOrders = [...state.orders, newOrder];
    return {
      orders: updatedOrders,
      customerOrders: [...state.customerOrders, newOrder],
      alert: updatedOrders.filter(o => o.status !== 'completed').length > 7
        ? 'High Kitchen Load — Delays Expected'
        : null,
    };
  }),

  advanceStatus: (orderId) => set((state) => {
    const statusMap = { pending: 'cooking', cooking: 'ready', ready: 'completed' };
    const updatedOrders = state.orders.map(order =>
      order.id === orderId ? { ...order, status: statusMap[order.status] } : order
    ).filter(order => order.status !== 'completed');

    const updatedCustomerOrders = state.customerOrders.map(order =>
      order.id === orderId ? { ...order, status: statusMap[order.status] || 'completed' } : order
    );

    return {
      orders: updatedOrders,
      customerOrders: updatedCustomerOrders,
      alert: updatedOrders.length > 7 ? 'High Kitchen Load — Delays Expected' : null,
    };
  }),

  getOrdersByChef: (chefEmail) => {
    return get().orders.filter(o => o.chefId === chefEmail);
  },

  getOrdersByTable: (tableNo) => {
    return get().orders.filter(o => o.tableNo === tableNo);
  },

  getStats: () => {
    const orders = get().orders;
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      cooking: orders.filter(o => o.status === 'cooking').length,
      ready: orders.filter(o => o.status === 'ready').length,
    };
  },

  getRevenueStats: () => {
    // Simulated revenue data
    return {
      todayRevenue: 24850,
      weekRevenue: 168400,
      avgOrderValue: 485,
      totalOrdersToday: 51,
    };
  },

  clearCustomerOrders: () => set({ customerOrders: [] }),
}));

export default useOrderStore;
