import React from 'react';
import { Star, Clock, Tag } from 'lucide-react';

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={() => onClick(restaurant)}
      className="bg-white rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/80 border border-gray-100/80 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Container with overlay badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark Vignette Gradient for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {restaurant.isPureVeg ? (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Pure Veg
            </span>
          ) : (
            <span className="bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              Multi-Cuisine
            </span>
          )}

          {restaurant.offer && (
            <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" /> {restaurant.offer}
            </span>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold z-10">
          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-orange-400" /> {restaurant.deliveryTime}
          </span>
          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            ₹{restaurant.costForTwo} FOR TWO
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-500 transition-colors truncate">
              {restaurant.name}
            </h3>

            {/* Rating Badge */}
            <div className="flex items-center space-x-1 bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0 shadow-xs">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>

          <p className="text-xs font-medium text-gray-500 mt-1 truncate">
            {restaurant.cuisine.join(', ')}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {restaurant.location}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold">
          <span className="text-orange-500 font-bold group-hover:underline flex items-center gap-1">
            View Menu & Offers →
          </span>
          <span className="text-[11px] text-gray-400">
            {restaurant.menu?.length || 0} Dishes
          </span>
        </div>
      </div>
    </div>
  );
}
