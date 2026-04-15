import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import CustomerMenu from './pages/CustomerMenu';
import ReceptionDashboard from './pages/ReceptionDashboard';
import useAuthStore from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return children;
};

// Layout with Sidebar and Navbar
const AppLayout = ({ children }) => (
  <div className="flex flex-col h-screen bg-royal-black">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-royal-black relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-amber/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        {children}
      </main>
    </div>
  </div>
);

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
             <div className="bg-royal-black min-h-screen text-white"><CustomerMenu /></div>
          </ProtectedRoute>
        } />
        
        <Route path="/chef" element={
          <ProtectedRoute allowedRoles={['chef']}>
            <AppLayout><Home /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/reception" element={
          <ProtectedRoute allowedRoles={['reception']}>
            <AppLayout><ReceptionDashboard /></AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={
          <Navigate to={user ? `/${user.role}` : "/login"} replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
