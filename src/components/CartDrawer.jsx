import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Tag, 
  CreditCard, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ isOpen, onClose, onOrderPlaced, selectedLocation }) {
  const { user } = useAuth();
  const { 
    cartItems, 
    selectedRestaurant, 
    appliedCoupon, 
    discountAmount,
    itemTotal,
    taxesAndFee,
    grandTotal,
    addToCart, 
    removeFromCart, 
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay / PhonePe)');
  const [customerName, setCustomerName] = useState(user?.name || 'Aarav Mehta');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartAmount: itemTotal })
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.coupon, data.discountAmount);
        setCouponSuccess(data.message);
        setCouponCode('');
      } else {
        setCouponError(data.message);
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        deliveryAddress: selectedLocation,
        restaurantId: selectedRestaurant?.id,
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        itemTotal,
        taxesAndFee,
        discount: discountAmount,
        grandTotal,
        paymentMethod
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success) {
        // Confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        onClose();
        onOrderPlaced(data.order);
      }
    } catch (err) {
      alert('Failed to place order. Please make sure Backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Cart Drawer Header */}
        <div className="p-5 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Your Checkout Cart</h2>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">
                From {selectedRestaurant ? selectedRestaurant.name : 'Zesto Partner'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <img
              src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=300&auto=format&fit=crop&q=80"
              alt="Empty Cart"
              className="w-44 h-44 object-cover rounded-full mb-4 opacity-80"
            />
            <h3 className="text-xl font-extrabold text-gray-900">Your cart is empty</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Good food is always calling! Explore top restaurants and add your favorite dishes.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Delivery Address Card */}
            <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-100/80">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                      Delivering to Home
                    </span>
                    <p className="text-xs text-gray-800 font-bold mt-0.5">
                      {selectedLocation}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Standard Delivery • Estimated 25-30 min
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Order Items ({cartItems.length})
              </h4>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 border flex items-center justify-center p-0.5 ${
                      item.isVeg ? 'border-emerald-600' : 'border-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs font-bold text-gray-600">
                        ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="bg-white border border-emerald-600 text-emerald-600 text-xs font-black px-2 py-1 rounded-xl flex items-center gap-2 shadow-2xs">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hover:text-amber-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item, selectedRestaurant)}
                      className="hover:text-amber-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-orange-500" /> Apply Coupon
                </span>
                {appliedCoupon && (
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-bold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border border-emerald-200">
                  <span>Applied '{appliedCoupon.code}' (-₹{discountAmount})</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code e.g. ZESTO50"
                    className="flex-1 bg-gray-100 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl outline-none border border-transparent focus:border-orange-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-medium">
                  {couponSuccess}
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                Payment Option
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Cash on Delivery', 'Paytm Wallet'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                      paymentMethod === method
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/60 space-y-2 text-xs">
              <h4 className="font-black text-gray-900 uppercase tracking-wider">
                Bill Details
              </h4>
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-semibold">
                <span>Delivery Fee & GST (5%)</span>
                <span>₹{taxesAndFee}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                <span>To Pay</span>
                <span className="text-orange-500 text-base">₹{grandTotal}</span>
              </div>
            </div>

          </div>
        )}

        {/* Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100">
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all flex items-center justify-between disabled:opacity-50"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs uppercase text-white/80 font-bold">Total ₹{grandTotal}</span>
                <span>{isSubmitting ? 'PLACING ORDER...' : 'PROCEED TO PAY & PLACE ORDER'}</span>
              </div>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
