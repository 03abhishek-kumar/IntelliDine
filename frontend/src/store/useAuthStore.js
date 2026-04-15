import { create } from 'zustand';

const DEMO_CREDENTIALS = {
  'owner@intellidine.com': { role: 'owner', name: 'Arjun Sharma', password: 'owner123' },
  'chef@intellidine.com': { role: 'chef', name: 'Chef Ahmed', password: 'chef123' },
  'chef2@intellidine.com': { role: 'chef', name: 'Chef Sana', password: 'chef123' },
  'reception@intellidine.com': { role: 'reception', name: 'Priya Kapoor', password: 'reception123' },
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('intellidine_auth');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  localStorage.setItem('intellidine_auth', JSON.stringify(data));
};

const clearStorage = () => {
  localStorage.removeItem('intellidine_auth');
};

const savedAuth = loadFromStorage();

const useAuthStore = create((set) => ({
  user: savedAuth?.user || null,
  role: savedAuth?.role || null,
  isAuthenticated: !!savedAuth,
  error: null,

  login: (email, password, selectedRole) => {
    // Owner / Chef / Reception: check predefined credentials
    const knownUser = DEMO_CREDENTIALS[email.toLowerCase()];

    if (knownUser) {
      if (knownUser.password !== password) {
        set({ error: 'Invalid password. Please try again.' });
        return false;
      }
      if (selectedRole && knownUser.role !== selectedRole) {
        set({ error: `This account is registered as "${knownUser.role}", not "${selectedRole}".` });
        return false;
      }
      const authData = { user: { name: knownUser.name, email }, role: knownUser.role };
      saveToStorage(authData);
      set({ user: authData.user, role: knownUser.role, isAuthenticated: true, error: null });
      return true;
    }

    // Customer: any valid email+password (min 6 chars) logs in as customer
    if (selectedRole === 'customer' || !selectedRole) {
      if (password.length < 6) {
        set({ error: 'Password must be at least 6 characters.' });
        return false;
      }
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
      const authData = { user: { name, email }, role: 'customer' };
      saveToStorage(authData);
      set({ user: authData.user, role: 'customer', isAuthenticated: true, error: null });
      return true;
    }

    set({ error: 'Account not found. Check credentials or role.' });
    return false;
  },

  logout: () => {
    clearStorage();
    set({ user: null, role: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
