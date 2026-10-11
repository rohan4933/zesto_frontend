import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Info, 
  X, 
  Flame,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RestaurantDetailModal({ restaurant, onClose }) {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!restaurant) return null;

  // Filter items
  const menuItems = (restaurant.menu || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesVeg = vegOnly ? item.isVeg : true;
    const matchesCat = selectedCategory === 'All' ? true : item.category === selectedCategory;
    return matchesSearch && matchesVeg && matchesCat;
  });

  const categories = ['All', ...new Set((restaurant.menu || []).map((i) => i.category))];

  const getItemQuantity = (itemId) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Hero Image & Info */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 bg-gray-900">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-60"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {restaurant.offer || 'PREMIUM RESTAURANT'}
              </span>
              {restaurant.isPureVeg && (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  PURE VEG
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {restaurant.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 font-medium">
              {restaurant.cuisine.join(', ')} • {restaurant.location}
            </p>
            
            <div className="flex items-center gap-4 mt-2 text-xs font-bold">
              <span className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded text-white">
                <Star className="w-3.5 h-3.5 fill-current" /> {restaurant.rating} ({restaurant.ratingCount})
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> {restaurant.deliveryTime}
              </span>
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                ₹{restaurant.costForTwo} for two
              </span>
            </div>
          </div>
        </div>

        {/* Menu Search & Category Filters Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search in menu..."
                className="w-full bg-white text-gray-800 text-sm font-medium rounded-xl pl-9 pr-4 py-2 border border-gray-200 focus:border-orange-500 focus:outline-none shadow-xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Veg Only Toggle */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <label className="flex items-center cursor-pointer select-none text-xs font-bold text-gray-700 space-x-2">
                <span>Veg Only</span>
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors relative ${vegOnly ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${vegOnly ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {menuItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-base font-bold">No dishes found matching your criteria</p>
              <button
                onClick={() => { setMenuSearch(''); setVegOnly(false); setSelectedCategory('All'); }}
                className="mt-2 text-xs font-bold text-orange-500 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            menuItems.map((item) => {
              const qty = getItemQuantity(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  {/* Item Description Left */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {/* Veg / Non-Veg Indicator Icon */}
                      <span className={`w-4 h-4 border flex items-center justify-center p-0.5 rounded-xs ${
                        item.isVeg ? 'border-emerald-600' : 'border-red-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                      </span>

                      {item.isBestseller && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                          <Flame className="w-3 h-3 text-amber-600 fill-current" /> Bestseller
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-gray-900">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-2 text-sm font-black text-gray-800">
                      <span>₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through font-normal">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 max-w-xl line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Item Image & Add Button Right */}
                  <div className="relative shrink-0 w-full sm:w-32 h-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Add to Cart Button */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 shadow-lg">
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item, restaurant)}
                          className="bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-600 font-black text-xs uppercase px-5 py-1.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1"
                        >
                          ADD <Plus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <div className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-3 shadow-md">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="hover:text-amber-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span>{qty}</span>
                          <button
                            onClick={() => addToCart(item, restaurant)}
                            className="hover:text-amber-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
