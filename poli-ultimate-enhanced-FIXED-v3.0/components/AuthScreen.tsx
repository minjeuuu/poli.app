import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Sparkles, Globe } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string, password: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Local authentication - store credentials in localStorage
    if (isLogin) {
      // Check if user exists
      const storedPassword = localStorage.getItem(`user_${username}`);
      if (!storedPassword) {
        setError('User not found. Please sign up first.');
        return;
      }
      if (storedPassword !== password) {
        setError('Incorrect password');
        return;
      }
    } else {
      // Sign up - store new user
      const existingUser = localStorage.getItem(`user_${username}`);
      if (existingUser) {
        setError('Username already exists. Please choose another.');
        return;
      }
      localStorage.setItem(`user_${username}`, password);
      localStorage.setItem(`user_${username}_email`, email);
    }

    onLogin(username, password);
  };

  const handleGuestLogin = () => {
    onLogin('guest', 'guest');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDJ2MmgtMnptMCAxMGgydjJoLTJ6bTAgMTBoMnYyaC0yek0yNiAxNGgydjJoLTJ6bTAgMTBoMnYyaC0yek0xNiAxNGgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                POLI
              </p>
            </div>

            <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-purple-200">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-transparent px-2 text-purple-200">or</span>
                </div>
              </div>

              <button
                onClick={handleGuestLogin}
                className="w-full bg-white/5 border border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Continue as Guest
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-purple-200 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-300 hover:text-white font-semibold transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>

          <div className="bg-black/20 px-8 py-4 sm:px-12">
            <p className="text-purple-200/70 text-xs text-center">
              By continuing, you agree to POLI's Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-purple-200/50 text-sm">
            © 2024 POLI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
