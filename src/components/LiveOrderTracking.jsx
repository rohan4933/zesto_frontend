import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Utensils, 
  Bike, 
  Home, 
  MessageSquare,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { socket } from '../services/socket';

export default function LiveOrderTracking({ activeOrder, onBackToHome }) {
  const [order, setOrder] = useState(activeOrder);
  const [riderProgress, setRiderProgress] = useState(40); // 0 to 100% on live map line
  const [chatMessages, setChatMessages] = useState([
    { sender: 'rider', text: 'Hi! I am on my way to pick up your fresh meal from the restaurant.' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!activeOrder) return;
    setOrder(activeOrder);

    // Join Socket room for this order
    socket.emit('join_order_room', activeOrder.orderId);

    // Listen for live updates
    const handleOrderUpdate = (updatedOrder) => {
      if (updatedOrder.orderId === activeOrder.orderId) {
        setOrder(updatedOrder);
      }
    };

    socket.on('order:updated', handleOrderUpdate);

    // Animate map rider progress
    const interval = setInterval(() => {
      setRiderProgress((prev) => (prev >= 90 ? 90 : prev + 2));
    }, 3000);

    return () => {
      socket.off('order:updated', handleOrderUpdate);
      clearInterval(interval);
    };
  }, [activeOrder]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">No active order to track</h2>
        <p className="text-xs text-gray-500 mt-1">Place an order to see real-time delivery tracking here.</p>
        <button
          onClick={onBackToHome}
          className="mt-4 bg-orange-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const statusSteps = ['Placed', 'Confirmed', 'Preparing', 'On The Way', 'Delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: newMessage }]);
    setNewMessage('');

    // Auto simulated rider response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'rider', text: 'Got it! Reaching your gate shortly.' }]);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full pulse-badge">
                LIVE TRACKING
              </span>
              <span className="text-xs text-slate-400 font-bold">
                ID: {order.orderId}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Order {order.status === 'Delivered' ? 'Delivered 🎉' : 'is ' + order.status}
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              From <strong className="text-orange-400">{order.restaurantName}</strong> to {order.deliveryAddress.split(',')[0]}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">ESTIMATED ARRIVAL</span>
              <p className="text-xl font-black text-white">
                {order.status === 'Delivered' ? 'ARRIVED' : `${order.etaMinutes || 15} MINS`}
              </p>
            </div>
          </div>
        </div>

        {/* Status Stepper Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 relative z-10">
          <div className="grid grid-cols-5 gap-2 text-center">
            {statusSteps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110 shadow-md shadow-orange-500/50'
                      : isPassed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 hidden sm:inline ${
                    isCurrent ? 'text-orange-400 font-black' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Animated GPS Map Simulation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center justify-between">
              <span>Live Delivery Route</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> GPS Sync Active
              </span>
            </h3>

            {/* Canvas/SVG Simulated Route Map */}
            <div className="relative h-72 w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4">
              {/* Map grid background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Path Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50 200 C 150 100, 300 250, 450 120"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="6"
                  strokeDasharray="6 6"
                />
                <path
                  d="M 50 200 C 150 100, 300 250, 450 120"
                  fill="none"
                  stroke="#FC8019"
                  strokeWidth="6"
                />
              </svg>

              {/* Restaurant Marker */}
              <div className="absolute left-6 bottom-12 flex flex-col items-center group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded mt-1 shadow-md">
                  {order.restaurantName}
                </span>
              </div>

              {/* Moving Rider Icon Marker */}
              <div 
                className="absolute transition-all duration-1000 flex flex-col items-center z-20"
                style={{
                  left: `${riderProgress}%`,
                  top: `${140 - Math.sin(riderProgress / 15) * 40}px`
                }}
              >
                <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-xl border-3 border-white animate-bounce">
                  <Bike className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-lg">
                  {order.rider?.name || 'Rider'}
                </span>
              </div>

              {/* Customer House Marker */}
              <div className="absolute right-6 top-12 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded mt-1 shadow-md">
                  Delivery Location
                </span>
              </div>
            </div>

            {/* Delivery Agent Profile Card */}
            {order.rider && (
              <div className="mt-6 bg-orange-50/70 p-4 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={order.rider.avatar}
                    alt={order.rider.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{order.rider.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">
                      Delivery Partner • ⭐ {order.rider.rating} • {order.rider.vehicle}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${order.rider.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Phone className="w-4 h-4" /> Call Rider
                </a>
              </div>
            )}
          </div>

          {/* Order Item Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base font-black text-gray-900 mb-3">Order Details</h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex justify-between text-xs font-bold">
                  <span className="text-gray-800">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
              <span>Paid via {order.paymentMethod}</span>
              <span className="text-orange-500">Total ₹{order.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat with Rider */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" /> Chat with Delivery Partner
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ONLINE
              </span>
            </div>

            {/* Chat Bubble Scroll container */}
            <div className="space-y-3 h-[360px] overflow-y-auto pr-1">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] font-medium ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                    {msg.sender === 'user' ? 'You' : order.rider?.name || 'Rider'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-gray-100">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask rider for delivery update..."
              className="flex-1 bg-gray-100 text-xs text-gray-800 font-medium px-3.5 py-2.5 rounded-xl outline-none border border-transparent focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
