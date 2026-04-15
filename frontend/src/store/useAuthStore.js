import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  
  login: async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Register Error:", error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
