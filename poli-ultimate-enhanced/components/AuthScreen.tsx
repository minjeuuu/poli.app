
import React, { useState } from 'react';
import Logo from './Logo';
import { ArrowRight, User, Lock, Mail, Globe, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { playSFX } from '../services/soundService';
import { signUp, signIn, signInAsGuest } from '../services/auth/localAuth';

interface AuthScreenProps {
  onLogin: (user: any) => void;
  onGuest: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSFX('click');
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let user;
      
      if (mode === 'signup') {
        // Sign up
        if (!formData.username.trim()) {
          throw new Error('Username is required');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        
        user = await signUp(formData.email, formData.password, formData.username);
        setSuccess('Account created successfully!');
        playSFX('success');
        
        // Auto-login after signup
        setTimeout(() => {
          onLogin(user);
        }, 1000);
      } else {
        // Sign in
        user = await signIn(formData.email, formData.password);
        playSFX('success');
        onLogin(user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      playSFX('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    playSFX('click');
    const guestUser = signInAsGuest();
    onLogin(guestUser);
  };

  const switchMode = (m: 'login' | 'signup') => {
      playSFX('click');
      setMode(m);
      setError(null);
      setSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-academic-bg dark:bg-stone-950 flex flex-col items-center justify-center p-6 transition-colors duration-700">
       
       <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="text-center mb-10">
               <Logo size="xl" className="mx-auto mb-6" />
               <h1 className="text-5xl font-serif font-bold text-academic-text dark:text-stone-100 mb-2 tracking-tight">POLI</h1>
               <p className="text-xs text-stone-500 dark:text-stone-400 tracking-widest uppercase">
                 {firebaseEnabled ? '🔒 Secure Cloud Authentication' : '💾 Local Storage Mode'}
               </p>
           </div>

           <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden relative">
               {/* Decorative Gradient */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-academic-accent via-academic-gold to-academic-accent"></div>

               <div className="p-8">
                   <div className="flex gap-4 mb-8 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                       <button 
                        onClick={() => switchMode('login')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${mode === 'login' ? 'bg-white dark:bg-stone-700 shadow-sm text-academic-text dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                       >
                           Log In
                       </button>
                       <button 
                        onClick={() => switchMode('signup')}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${mode === 'signup' ? 'bg-white dark:bg-stone-700 shadow-sm text-academic-text dark:text-white' : 'text-stone-400 hover:text-stone-600'}`}
                       >
                           Sign Up
                       </button>
                   </div>

                   {error && (
                     <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                       <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                       <p className="text-xs text-red-800 dark:text-red-200">{error}</p>
                     </div>
                   )}

                   {success && (
                     <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                       <p className="text-xs text-green-800 dark:text-green-200">{success}</p>
                     </div>
                   )}

                   <form onSubmit={handleSubmit} className="space-y-4">
                       {mode === 'signup' && (
                           <div className="relative group">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-academic-gold transition-colors" />
                               <input 
                                type="text" 
                                placeholder="Username"
                                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium outline-none focus:border-academic-gold transition-all text-academic-text dark:text-white"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                onFocus={() => playSFX('hover')}
                                required
                               />
                           </div>
                       )}
                       <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-academic-gold transition-colors" />
                           <input 
                            type="email" 
                            placeholder="Email Address"
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium outline-none focus:border-academic-gold transition-all text-academic-text dark:text-white"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            onFocus={() => playSFX('hover')}
                            required
                           />
                       </div>
                       <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-academic-gold transition-colors" />
                           <input 
                            type="password" 
                            placeholder="Password (min 6 characters)"
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium outline-none focus:border-academic-gold transition-all text-academic-text dark:text-white"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            onFocus={() => playSFX('hover')}
                            minLength={6}
                            required
                           />
                       </div>

                       <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-academic-accent dark:bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-stone-800 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                           {loading ? 'Authenticating...' : (mode === 'login' ? 'Access Archive' : 'Create Account')} <ArrowRight className="w-4 h-4" />
                       </button>
                   </form>

                   {/* Google Sign In */}
                   <div className="mt-6">
                     <div className="relative">
                       <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
                       </div>
                       <div className="relative flex justify-center text-xs uppercase">
                         <span className="bg-white dark:bg-stone-900 px-2 text-stone-500 dark:text-stone-400">
                           Or continue with
                         </span>
                       </div>
                     </div>

                     <button
                       onClick={handleGoogleSignIn}
                       disabled={loading || !firebaseEnabled}
                       className="mt-4 w-full py-3 bg-white dark:bg-stone-800 border-2 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-sm rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                       onMouseEnter={() => playSFX('hover')}
                     >
                       <Chrome className="w-5 h-5" />
                       Sign in with Google
                     </button>
                   </div>
               </div>
           </div>

           <div className="mt-8 text-center space-y-4">
               <button 
                onClick={() => { playSFX('click'); onGuest(); }}
                className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-academic-accent dark:hover:text-white transition-colors flex items-center justify-center gap-2 w-full"
                onMouseEnter={() => playSFX('hover')}
               >
                   <Globe className="w-4 h-4" /> Continue as Guest
               </button>
               <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                   <ShieldCheck className="w-3 h-3" /> {firebaseEnabled ? 'Firebase Secure Authentication' : 'Browser Encrypted Storage'}
               </div>
           </div>
       </div>
    </div>
  );
};

export default AuthScreen;
