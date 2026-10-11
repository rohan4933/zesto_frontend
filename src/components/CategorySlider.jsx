import React from 'react';

export default function CategorySlider({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="py-6 border-b border-gray-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            What's on your mind?
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {/* Horizontal Circle Scroll */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                className="flex flex-col items-center cursor-pointer group shrink-0"
              >
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 ${
                  isSelected 
                    ? 'ring-4 ring-orange-500 shadow-lg shadow-orange-500/20 scale-105' 
                    : 'group-hover:scale-105 group-hover:shadow-md'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:rotate-1 transition-transform duration-500"
                  />
                </div>
                <span className={`mt-2 text-sm font-bold transition-colors ${
                  isSelected ? 'text-orange-500' : 'text-gray-700 group-hover:text-orange-500'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
