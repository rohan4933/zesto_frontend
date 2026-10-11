import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, Mail, Lock, Phone, User as UserIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CUSTOMER');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = await signup(name, email, password, phone, role);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setErrorMsg(res.message);
        }
      }
    } catch (err) {
      setErrorMsg('Network error. Is Spring Boot server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);
    const res = await login(demoEmail, demoPassword);
    if (res.success) {
      setSuccessMsg(`Logged in as ${res.user.name}`);
      setTimeout(() => onClose(), 800);
    } else {
      setErrorMsg(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-sm font-black transition-all border-b-2 ${
              mode === 'login'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-sm font-black transition-all border-b-2 ${
              mode === 'signup'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Header Title */}
        <div className="mb-5 space-y-1">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            {mode === 'login' ? (
              <>
                <LogIn className="w-6 h-6 text-orange-500" /> Welcome to Zesto
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6 text-orange-500" /> Join Zesto Today
              </>
            )}
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            {mode === 'login'
              ? 'Enter your credentials to unlock fast food delivery'
              : 'Sign up to order food, track live riders & get promo deals'}
          </p>
        </div>

        {/* Quick Demo Logins Bar */}
        {mode === 'login' && (
          <div className="mb-5 bg-orange-50/80 p-3.5 rounded-2xl border border-orange-100 space-y-2">
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo One-Click Sign In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer@zesto.com', 'password123')}
                className="bg-white hover:bg-orange-100 text-gray-800 text-[11px] font-extrabold p-2 rounded-xl border border-orange-200 shadow-2xs transition-all text-left"
              >
                🙋‍♂️ Customer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@zesto.com', 'admin123')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-extrabold p-2 rounded-xl shadow-2xs transition-all text-left flex items-center justify-between"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1 block">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Mehta"
                  className="w-full bg-gray-100 text-xs font-semibold text-gray-800 px-3.5 py-2.5 pl-9 rounded-xl outline-none border border-transparent focus:border-orange-500 focus:bg-white"
                />
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full bg-gray-100 text-xs font-semibold text-gray-800 px-3.5 py-2.5 pl-9 rounded-xl outline-none border border-transparent focus:border-orange-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-100 text-xs font-semibold text-gray-800 px-3.5 py-2.5 pl-9 rounded-xl outline-none border border-transparent focus:border-orange-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Mobile Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-100 text-xs font-semibold text-gray-800 px-3.5 py-2.5 pl-9 rounded-xl outline-none border border-transparent focus:border-orange-500 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-100 text-xs font-bold text-gray-800 p-2.5 rounded-xl border border-transparent focus:border-orange-500 outline-none"
                >
                  <option value="CUSTOMER">Customer (Order Food)</option>
                  <option value="ADMIN">Administrator (Manage Platform & Live Orders)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-orange-500/30 transition-all uppercase tracking-wider mt-2 disabled:opacity-50"
          >
            {isSubmitting ? 'PROCESSING...' : mode === 'login' ? 'SIGN IN NOW' : 'CREATE ACCOUNT'}
          </button>
        </form>

      </div>
    </div>
  );
}
