import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  Zap, 
  Award, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  UtensilsCrossed
} from 'lucide-react';

export default function AboutSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const stats = [
    { label: 'Cities Covered', value: '500+' },
    { label: 'Restaurant Partners', value: '150,000+' },
    { label: 'Daily Satisfied Foodies', value: '2.5 Million+' },
    { label: 'Avg Delivery Time', value: '22 Mins' }
  ];

  const values = [
    {
      title: 'Customer First Always',
      desc: 'Every feature we build and every meal we deliver puts the hunger and happiness of our foodies at the center.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-500'
    },
    {
      title: 'Hyper-Fast Delivery',
      desc: 'Leveraging real-time AI route optimization and dedicated rider fleets to deliver piping hot food in record time.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-500'
    },
    {
      title: 'Culinary Quality & Safety',
      desc: 'Partnering only with hygiene-certified restaurants and offering insulated temperature-controlled packaging.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-500'
    },
    {
      title: 'Empowering Local Chefs',
      desc: 'Giving neighborhood cloud kitchens & iconic local eateries national visibility and digital order management.',
      icon: Award,
      color: 'bg-indigo-50 text-indigo-500'
    }
  ];

  const faqs = [
    {
      q: 'What makes Zesto different from standard food delivery apps?',
      a: 'Zesto combines Swiggy-like seamless user experience with hyper-local AI routing, zero surge delivery pricing for members, and live real-time Socket tracking so you see your delivery rider move every second on the map.'
    },
    {
      q: 'How does Zesto ensure food stays fresh and hot during delivery?',
      a: 'Our delivery partners use thermal insulated multi-layer bags that seal in heat. Also, our smart dispatch system assigns the nearest available rider before the food finishes cooking.'
    },
    {
      q: 'How can I become a Zesto Restaurant Partner?',
      a: 'Register your restaurant directly through our Live Admin Dashboard or reach out to partner@zesto.com. Onboarding takes less than 24 hours!'
    },
    {
      q: 'What is Zesto Money-Back Guarantee on delays?',
      a: 'If your order takes longer than the promised ETA due to our delay, you get 100% of your delivery fee credited instantly to your Zesto wallet.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> ABOUT ZESTO
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Connecting Every Cravings to Local Flavor Extraordinaire.
        </h1>
        <p className="text-base text-gray-600 font-medium leading-relaxed">
          Zesto was born with a single mission: to deliver happiness, hot meals, and iconic neighborhood flavors to your doorstep within minutes.
        </p>
      </div>

      {/* Stats Counter Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i} className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-orange-400">{s.value}</h3>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Our Values Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">What Drives Us</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Our core values behind every meal delivered</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow">
                <div className={`p-3.5 rounded-2xl ${v.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{v.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Got questions? We've got answers.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  className="w-full flex justify-between items-center text-left text-sm font-extrabold text-gray-900 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-orange-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 font-medium mt-2 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
