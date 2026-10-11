import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategorySlider from './components/CategorySlider';
import BannerCarousel from './components/BannerCarousel';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import CartDrawer from './components/CartDrawer';
import LiveOrderTracking from './components/LiveOrderTracking';
import AdminDashboard from './components/AdminDashboard';
import AboutSection from './components/AboutSection';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UtensilsCrossed } from 'lucide-react';

function ZestoApp() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'about', 'track', 'admin'
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bangalore');
  
  // Quick Filter States
  const [filterPureVeg, setFilterPureVeg] = useState(false);
  const [filterRating4Plus, setFilterRating4Plus] = useState(false);
  const [filterFastDelivery, setFilterFastDelivery] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Modals & Active State
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Load Categories & Initial Restaurants
  useEffect(() => {
    fetchCategories();
    fetchRestaurants();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
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

  // Filter & Sort Logic
  const filteredRestaurants = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.some(c => c.toLowerCase().includes(q)) ||
      (r.menu || []).some(m => m.name.toLowerCase().includes(q))
    );

    const matchesCategory = !selectedCategory || (
      r.cuisine.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (r.menu || []).some(m => m.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    );

    const matchesVeg = filterPureVeg ? r.isPureVeg : true;
    const matchesRating = filterRating4Plus ? r.rating >= 4.4 : true;
    const matchesFast = filterFastDelivery ? parseInt(r.deliveryTime) <= 25 : true;

    return matchesSearch && matchesCategory && matchesVeg && matchesRating && matchesFast;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'costLow') return a.costForTwo - b.costForTwo;
    if (sortBy === 'costHigh') return b.costForTwo - a.costForTwo;
    return 0;
  });

  const handleOrderPlaced = (order) => {
    setActiveOrder(order);
    setCurrentTab('track');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      
      {/* Header Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setIsCartOpen={setIsCartOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <BannerCarousel />

            <CategorySlider
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    Restaurants with online food delivery in {selectedLocation.split(',')[0]}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Showing {filteredRestaurants.length} top rated spots nearby
                  </p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={() => setFilterPureVeg(!filterPureVeg)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      filterPureVeg
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Pure Veg
                  </button>

                  <button
                    onClick={() => setFilterRating4Plus(!filterRating4Plus)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      filterRating4Plus
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Ratings 4.4+
                  </button>

                  <button
                    onClick={() => setFilterFastDelivery(!filterFastDelivery)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                      filterFastDelivery
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Fast Delivery (&lt; 25m)
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white text-gray-700 border border-gray-300 font-bold text-xs px-3 py-1.5 rounded-full outline-none focus:border-orange-500 shrink-0"
                  >
                    <option value="relevance">Sort By: Relevance</option>
                    <option value="rating">Sort By: Rating (High-Low)</option>
                    <option value="costLow">Cost: Low to High</option>
                    <option value="costHigh">Cost: High to Low</option>
                  </select>
                </div>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-xs">
                  <UtensilsCrossed className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <h3 className="text-lg font-black text-gray-900">No restaurants match your search</h3>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setFilterPureVeg(false);
                      setFilterRating4Plus(false);
                      setFilterFastDelivery(false);
                    }}
                    className="mt-4 bg-orange-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={(rest) => setSelectedRestaurant(rest)}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

        {currentTab === 'about' && <AboutSection />}

        {currentTab === 'track' && (
          <LiveOrderTracking
            activeOrder={activeOrder}
            onBackToHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      <Footer />

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderPlaced={handleOrderPlaced}
        selectedLocation={selectedLocation}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ZestoApp />
      </CartProvider>
    </AuthProvider>
  );
}
