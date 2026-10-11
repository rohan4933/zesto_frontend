import React from 'react';
import { Sparkles, TrendingUp, Zap, Gift } from 'lucide-react';

export default function BannerCarousel() {
  const banners = [
    {
      id: 1,
      title: '50% OFF UP TO ₹120',
      subtitle: 'Use code ZESTO50 | Valid on top biryani & pizza joints',
      tag: 'BESTSELLER',
      bgGradient: 'from-orange-600 via-amber-600 to-amber-500',
      icon: Zap
    },
    {
      id: 2,
      title: 'FREE DELIVERY ON ALL ORDERS',
      subtitle: 'Use code FREEDEL | Zero delivery fee for all food lovers',
      tag: 'HOT DEAL',
      bgGradient: 'from-emerald-700 via-teal-600 to-emerald-500',
      icon: Gift
    },
    {
      id: 3,
      title: 'FLAT ₹200 OFF ON GOURMET',
      subtitle: 'Experience royal dining at home with WELCOME200 coupon',
      tag: 'PREMIUM',
      bgGradient: 'from-purple-700 via-indigo-600 to-purple-500',
      icon: Sparkles
    }
  ];

  return (
    <div className="py-6 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Best offers for you
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {banners.map((b) => {
            const IconComponent = b.icon;
            return (
              <div
                key={b.id}
                className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r ${b.bgGradient} text-white shadow-lg shadow-gray-200/50 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
              >
                {/* Decorative background shapes */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase mb-2">
                      {b.tag}
                    </span>
                    <h3 className="text-xl font-black tracking-tight leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-xs text-white/90 font-medium mt-1">
                      {b.subtitle}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
