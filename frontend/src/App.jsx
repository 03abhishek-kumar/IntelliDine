import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import ChefDashboard from './pages/ChefDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import useAuthStore from './store/useAuthStore';

const AppShell = ({ children }) => (
  <div className="flex flex-col h-screen bg-royal-black overflow-hidden">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-royal-black relative">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-amber/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        {children}
      </main>
    </div>
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, role } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const routes = { customer: '/customer', owner: '/owner', chef: '/chef', reception: '/reception' };
  return <Navigate to={routes[role] || '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        {/* Customer */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <AppShell><CustomerDashboard /></AppShell>
          </ProtectedRoute>
        } />

        {/* Owner */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AppShell><OwnerDashboard /></AppShell>
          </ProtectedRoute>
        } />

        {/* Chef */}
        <Route path="/chef" element={
          <ProtectedRoute allowedRoles={['chef']}>
            <AppShell><ChefDashboard /></AppShell>
          </ProtectedRoute>
        } />

        {/* Reception */}
        <Route path="/reception" element={
          <ProtectedRoute allowedRoles={['reception']}>
            <AppShell><ReceptionDashboard /></AppShell>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
