import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Tag, 
  HelpCircle, 
  User as UserIcon, 
  MapPin, 
  ChevronDown, 
  ShieldCheck, 
  Info,
  LayoutDashboard,
  UtensilsCrossed,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  setIsCartOpen, 
  setIsAuthModalOpen,
  searchQuery, 
  setSearchQuery,
  selectedLocation,
  setSelectedLocation
}) {
  const { totalItemCount } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const locations = [
    'Indiranagar, Bangalore',
    'Koramangala 4th Block, Bangalore',
    'HSR Layout Sector 1, Bangalore',
    'Jayanagar 3rd Block, Bangalore',
    'MG Road, Bangalore',
    'BTM Layout 2nd Stage, Bangalore'
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Left: Brand Logo & Location */}
            <div className="flex items-center space-x-6 sm:space-x-8">
              {/* Swiggy-styled Zesto Logo */}
              <div 
                onClick={() => setCurrentTab('home')}
                className="flex items-center space-x-2.5 cursor-pointer group"
              >
                <div className="w-11 h-11 bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-gray-900 leading-none group-hover:text-orange-500 transition-colors">
                    ZESTO<span className="text-orange-500">.</span>
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                    SPRING BOOT
                  </span>
                </div>
              </div>

              {/* Location Picker */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-500 transition-colors py-2 px-3 rounded-lg hover:bg-orange-50/50 group"
              >
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 group-hover:bounce" />
                <span className="font-bold border-b-2 border-gray-900 group-hover:border-orange-500 truncate max-w-[150px] lg:max-w-[200px]">
                  {selectedLocation.split(',')[0]}
                </span>
                <span className="text-gray-400 text-xs truncate max-w-[120px] hidden lg:inline">
                  , {selectedLocation.split(',')[1]}
                </span>
                <ChevronDown className="w-4 h-4 text-orange-500 shrink-0" />
              </button>
            </div>

            {/* Middle: Live Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurants, biryani, pizza or dishes..."
                  className="w-full bg-gray-100/80 text-gray-800 placeholder-gray-400 text-sm font-medium rounded-xl pl-11 pr-4 py-2.5 outline-none border border-transparent focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-2.5" />
              </div>
            </div>

            {/* Right: Nav Links & Auth */}
            <nav className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              
              {/* Offers */}
              <button
                onClick={() => setCurrentTab('home')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentTab === 'home' 
                    ? 'text-orange-500 bg-orange-50' 
                    : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Offers</span>
              </button>

              {/* About Section */}
              <button
                onClick={() => setCurrentTab('about')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  currentTab === 'about' 
                    ? 'text-orange-500 bg-orange-50' 
                    : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                }`}
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">About</span>
              </button>

              {/* Live Order Status Link */}
              <button
                onClick={() => setCurrentTab('track')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all relative ${
                  currentTab === 'track' 
                    ? 'text-orange-500 bg-orange-50' 
                    : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Track Order</span>
              </button>

              {/* Admin Dashboard Pill */}
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all shadow-xs ${
                  currentTab === 'admin'
                    ? 'bg-slate-900 text-white ring-2 ring-orange-500 ring-offset-1'
                    : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-orange-400" />
                <span className="hidden md:inline">Admin</span>
              </button>

              {/* Authentication Button / User Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-orange-50 text-gray-800 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                    {user.role === 'ADMIN' && (
                      <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">ADMIN</span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-black text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 font-extrabold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-orange-200"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-orange-600 font-extrabold text-[11px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-inner">
                  {totalItemCount}
                </span>
              </button>

            </nav>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> Select Delivery Location
              </h3>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationModalOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedLocation === loc
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
