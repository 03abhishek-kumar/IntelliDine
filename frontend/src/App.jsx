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
  <div className="flex flex-col h-screen overflow-hidden">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        {/* Ambient glows */}
        <div className="absolute top-[-240px] right-[-160px] w-[640px] h-[640px] bg-blue-500/12 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-260px] left-[-180px] w-[620px] h-[620px] bg-teal-400/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-sky-300/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative z-10 h-full">{children}</div>
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
  const { user } = useAuthStore();

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
