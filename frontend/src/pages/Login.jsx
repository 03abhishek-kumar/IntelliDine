import React, { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, register } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/'); // routing will automatically guide based on role
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-royal-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-royal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-royal-amber/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <motion.div 
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 rounded-3xl royal-glass shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold-gradient rounded-xl rotate-45 flex items-center justify-center shadow-gold-glow mb-6">
            <Shield className="text-royal-black -rotate-45" size={32} />
          </div>
          <h2 className="text-3xl font-royal gold-text-gradient tracking-widest uppercase text-center">
            {isLogin ? 'IntelliDine Portal' : 'Join The Table'}
          </h2>
          <p className="text-gray-400 font-playfair italic mt-2">
            {isLogin ? 'Enter the Command Center' : 'Create your Royal Customer Account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence>
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs uppercase tracking-widest text-royal-gold/80 ml-2">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-royal-gold/20 rounded-xl p-4 text-white focus:outline-none focus:border-royal-gold"
                  placeholder="Your Name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-royal-gold/80 ml-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-royal-gold/20 rounded-xl p-4 text-white focus:outline-none focus:border-royal-gold text-lg"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-royal-gold/80 ml-2">Passcode</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-royal-gold/20 rounded-xl p-4 text-white focus:outline-none focus:border-royal-gold tracking-[0.2em]"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-gold-gradient text-royal-black font-royal uppercase tracking-widest py-4 rounded-xl shadow-gold-glow hover:scale-[1.02] transition-transform font-bold text-lg"
          >
            {isLogin ? 'Authenticate' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          {isLogin ? "Don't have an account?" : "Already dining with us?"} {' '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-royal-gold hover:text-white transition"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>

        {/* Demo hints for hackathon */}
        <div className="mt-8 pt-4 border-t border-white/5 text-xs text-center text-gray-600">
           <p className="mb-1">Demo Emails:</p>
           <span>chef@intellidine.com</span> | <span>reception@intellidine.com</span>
           <p className="mt-1">Pass: password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
