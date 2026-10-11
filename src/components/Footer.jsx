import React from 'react';
import { UtensilsCrossed, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                ZESTO<span className="text-orange-500">.</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience Swiggy-speed food delivery with live GPS tracking, top local cloud kitchens, and exclusive promo discounts.
            </p>
            <p className="text-[11px] text-slate-500">
              © 2026 Zesto Technologies Pvt. Ltd. All rights reserved.
            </p>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li className="hover:text-orange-400 cursor-pointer">About Us</li>
              <li className="hover:text-orange-400 cursor-pointer">Zesto Corporate</li>
              <li className="hover:text-orange-400 cursor-pointer">Careers (We are hiring!)</li>
              <li className="hover:text-orange-400 cursor-pointer">Zesto One Subscription</li>
              <li className="hover:text-orange-400 cursor-pointer">Bug Bounty Program</li>
            </ul>
          </div>

          {/* Col 3: Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Contact & Help</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li className="hover:text-orange-400 cursor-pointer">Help & Support</li>
              <li className="hover:text-orange-400 cursor-pointer">Partner with Us</li>
              <li className="hover:text-orange-400 cursor-pointer">Ride with Us</li>
              <li className="hover:text-orange-400 cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-orange-400 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          {/* Col 4: Top Delivery Cities */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">We Deliver To</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
              {['Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh'].map((city) => (
                <span key={city} className="bg-slate-800 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded-md text-slate-400 transition-colors cursor-pointer">
                  {city}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for food lovers everywhere.
          </p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Facebook</span>
            <span className="hover:text-slate-300 cursor-pointer">Twitter</span>
            <span className="hover:text-slate-300 cursor-pointer">Instagram</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
