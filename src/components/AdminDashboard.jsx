import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Bike, 
  Plus, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Utensils, 
  Bell,
  Search,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { socket } from '../services/socket';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeOrdersCount: 0,
    activeRestaurants: 0,
    activeRiders: 0,
    ordersByStatus: {}
  });

  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [isAddRestModalOpen, setIsAddRestModalOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // New restaurant form state
  const [newRestForm, setNewRestForm] = useState({
    name: '',
    cuisine: '',
    costForTwo: 300,
    location: 'Bangalore',
    isPureVeg: false,
    offer: '20% OFF'
  });

  // Fetch initial data & set up Socket listeners
  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchRestaurants();

    socket.on('admin:stats_updated', (updatedStats) => {
      setStats(updatedStats);
    });

    socket.on('order:created', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      setNewOrderAlert(newOrder);
      setTimeout(() => setNewOrderAlert(null), 5000);
    });

    socket.on('order:updated', (updatedOrder) => {
      setOrders(prev => prev.map(o => o.orderId === updatedOrder.orderId ? updatedOrder : o));
    });

    socket.on('restaurants:updated', (updatedRests) => {
      setRestaurants(updatedRests);
    });

    return () => {
      socket.off('admin:stats_updated');
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('restaurants:updated');
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/restaurants');
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? data.order : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRestForm)
      });
      if (res.ok) {
        setIsAddRestModalOpen(false);
        setNewRestForm({ name: '', cuisine: '', costForTwo: 300, location: 'Bangalore', isPureVeg: false, offer: '20% OFF' });
        fetchRestaurants();
      }
    } catch (err) {
      alert('Error adding restaurant');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' ? true : o.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data
  const chartData = [
    { name: '10 AM', Orders: 12, Revenue: 3400 },
    { name: '12 PM', Orders: 28, Revenue: 7800 },
    { name: '2 PM', Orders: 45, Revenue: 12400 },
    { name: '4 PM', Orders: 22, Revenue: 5900 },
    { name: '6 PM', Orders: 39, Revenue: 10800 },
    { name: '8 PM', Orders: 64, Revenue: 18900 },
    { name: '10 PM', Orders: 31, Revenue: 8700 }
  ];

  const pieData = [
    { name: 'Biryani', value: 40, color: '#FC8019' },
    { name: 'Pizzas', value: 25, color: '#10B981' },
    { name: 'Burgers', value: 15, color: '#3B82F6' },
    { name: 'Chinese', value: 12, color: '#8B5CF6' },
    { name: 'Desserts', value: 8, color: '#EC4899' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Live Order Popup Toast */}
      {newOrderAlert && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-orange-500 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-orange-400">NEW LIVE ORDER RECEIVED!</h4>
            <p className="text-sm font-extrabold">{newOrderAlert.orderId} - ₹{newOrderAlert.grandTotal}</p>
            <p className="text-[11px] text-gray-300">Customer: {newOrderAlert.customerName}</p>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              LIVE CONTROL CENTER
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Zesto Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Monitor real-time restaurant orders, revenue analytics, & delivery fleet dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchStats(); fetchOrders(); }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs p-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
          <button
            onClick={() => setIsAddRestModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Restaurant
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <DollarSign className="w-5 h-5 bg-emerald-50 p-1 rounded-lg" />
            <span className="text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">+18.2%</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Total Revenue</span>
          <p className="text-2xl font-black text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-orange-500">
            <ShoppingBag className="w-5 h-5 bg-orange-50 p-1 rounded-lg" />
            <span className="text-[10px] font-bold bg-orange-50 px-2 py-0.5 rounded text-orange-700">LIVE</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Total Orders</span>
          <p className="text-2xl font-black text-gray-900">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Clock className="w-5 h-5 bg-amber-50 p-1 rounded-lg" />
            <span className="text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded text-amber-700">ACTIVE</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Live Active Orders</span>
          <p className="text-2xl font-black text-gray-900">{stats.activeOrdersCount}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-500">
            <Utensils className="w-5 h-5 bg-blue-50 p-1 rounded-lg" />
            <span className="text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded text-blue-700">ONLINE</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Restaurants</span>
          <p className="text-2xl font-black text-gray-900">{restaurants.length}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-purple-500">
            <Bike className="w-5 h-5 bg-purple-50 p-1 rounded-lg" />
            <span className="text-[10px] font-bold bg-purple-50 px-2 py-0.5 rounded text-purple-700">ON FLEET</span>
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase">Active Riders</span>
          <p className="text-2xl font-black text-gray-900">{stats.activeRiders}</p>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <h3 className="text-base font-black text-gray-900 mb-4 flex items-center justify-between">
            <span>Peak Hour Revenue & Order Volume</span>
            <span className="text-xs text-gray-400 font-bold">Today</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0' }} />
                <Bar dataKey="Revenue" fill="#FC8019" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <h3 className="text-base font-black text-gray-900 mb-4">Cuisine Breakdown</h3>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-gray-600">
            {pieData.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span>{p.name} ({p.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Orders Stream Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                Real-Time Customer Orders Stream
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  LIVE SOCKET ACTIVE
                </span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Click status buttons to update live tracking for users instantly.</p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search order ID, customer..."
                className="w-full bg-gray-100 text-xs text-gray-800 font-medium px-3.5 py-2 pl-9 rounded-xl outline-none border border-transparent focus:border-orange-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Placed', 'Confirmed', 'Preparing', 'On The Way', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStatusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Restaurant</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Current Status</th>
                <th className="py-3.5 px-6 text-right">Update Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-4 px-6 font-black text-gray-900">{ord.orderId}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{ord.customerName}</p>
                      <span className="text-[11px] text-gray-400">{ord.customerPhone}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700">{ord.restaurantName}</td>
                    <td className="py-4 px-6 font-black text-orange-600">₹{ord.grandTotal}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'On The Way' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      {['Preparing', 'On The Way', 'Delivered'].map((st) => (
                        <button
                          key={st}
                          disabled={ord.status === st}
                          onClick={() => handleUpdateStatus(ord.orderId, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            ord.status === st
                              ? 'bg-slate-900 text-white cursor-default'
                              : 'bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Restaurant Modal */}
      {isAddRestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-gray-900">Add Partner Restaurant</h3>
              <button onClick={() => setIsAddRestModalOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleAddRestaurant} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={newRestForm.name}
                  onChange={(e) => setNewRestForm({ ...newRestForm, name: e.target.value })}
                  placeholder="e.g. Spice Symphony"
                  className="w-full bg-gray-100 text-xs font-medium p-2.5 rounded-xl border outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Cuisine Tags (comma separated)</label>
                <input
                  type="text"
                  required
                  value={newRestForm.cuisine}
                  onChange={(e) => setNewRestForm({ ...newRestForm, cuisine: e.target.value })}
                  placeholder="North Indian, Kebabs, Biryani"
                  className="w-full bg-gray-100 text-xs font-medium p-2.5 rounded-xl border outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-700">Cost for Two (₹)</label>
                  <input
                    type="number"
                    value={newRestForm.costForTwo}
                    onChange={(e) => setNewRestForm({ ...newRestForm, costForTwo: e.target.value })}
                    className="w-full bg-gray-100 text-xs font-medium p-2.5 rounded-xl border outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Offer Badge</label>
                  <input
                    type="text"
                    value={newRestForm.offer}
                    onChange={(e) => setNewRestForm({ ...newRestForm, offer: e.target.value })}
                    className="w-full bg-gray-100 text-xs font-medium p-2.5 rounded-xl border outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-black text-xs py-3 rounded-xl shadow-md hover:bg-orange-600 mt-2"
              >
                SAVE RESTAURANT
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
