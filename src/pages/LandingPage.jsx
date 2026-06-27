import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Heart, HelpingHand, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const { activeUser } = useContext(AppContext);

  // Parallax state based on mouse coordinates for background layers
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 3D Tilt state for the cards
  const [tiltStyles, setTiltStyles] = useState({
    admin: {},
    helper: {},
    elder: {}
  });

  // Ripple state for clicking animation
  const [ripples, setRipples] = useState({
    admin: null,
    helper: null,
    elder: null
  });

  useEffect(() => {
    if (activeUser) {
      if (activeUser.role === 'Admin') navigate('/admin/dashboard');
      if (activeUser.role === 'Helper') navigate('/helper/dashboard');
      if (activeUser.role === 'Old Person') navigate('/old-person/dashboard');
    }
  }, [activeUser, navigate]);

  // Global mouse move listener for parallax background
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Card Mouse Move (Mouse Tilt & Follow Glow)
  const handleCardMouseMove = (e, key) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Relative coordinates [-1, 1]
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    const tiltX = -dy * 6;
    const tiltY = dx * 6;

    setTiltStyles(prev => ({
      ...prev,
      [key]: {
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`,
        '--mouse-x': `${x}px`,
        '--mouse-y': `${y}px`,
        transition: 'transform 0.05s ease-out'
      }
    }));
  };

  // Card Mouse Leave
  const handleCardMouseLeave = (key) => {
    setTiltStyles(prev => ({
      ...prev,
      [key]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }));
  };

  // Card Click Handler
  const handleCardClick = (e, key, route) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRipples(prev => ({
      ...prev,
      [key]: { x, y }
    }));

    setTimeout(() => {
      setRipples(prev => ({
        ...prev,
        [key]: null
      }));
      navigate(route);
    }, 450);
  };

  // Generate 25 premium floating background gold sparkles (Matches Helper Dashboard)
  const sparkles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${(i * 4) + 1}%`,
    delay: `${-(i * 1.5)}s`,
    duration: `${15 + (i % 4) * 4}s`,
    size: `${(i % 3) * 2.5 + 4}px`
  }));

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-800 relative overflow-hidden select-none">
      
      {/* ================= BACKGROUND IMAGE & OVERLAYS ================= */}
      {/* Real Generated Beautiful Zen Nature Landscape Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.9] z-0" 
        style={{ backgroundImage: "url('/bg_nature.png')" }} 
      />
      
      {/* Soft white-mint glaze overlay to ensure high contrast & legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F9F5]/75 via-[#FCFDFD]/60 to-[#F3F8F4]/70 z-0" />
      
      {/* 2. Floating Golden Sparkles */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`
        }}
      >
        {sparkles.map(sp => (
          <div 
            key={sp.id}
            className="bg-particle text-yellow-500/35 font-bold"
            style={{
              left: sp.left,
              fontSize: sp.size,
              '--delay': sp.delay,
              '--duration': sp.duration,
              '--max-opacity': 0.45
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* 3. Static Vector Wave Outline at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-[220px] opacity-[0.06] text-emerald-800 pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,160 L48,154.7 C96,149 192,139 288,144 C384,149 480,171 576,176 C672,181 768,171 864,154.7 C960,139 1056,117 1152,112 C1248,107 1344,117 1392,122.7 L1440,128 L1440,250 L1392,250 C1344,250 1248,250 1152,250 C1056,250 960,250 864,250 C768,250 672,250 576,250 C480,250 384,250 288,250 C192,250 96,250 48,250 L0,250 Z" />
        </svg>
      </div>

      {/* Grid Mesh Lines */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* ========================================================================= */}

      {/* Navigation Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-emerald-100/30 backdrop-blur-md bg-white/20 z-10">
        <div className="flex items-center gap-2">
          <Heart className="text-emerald-600 fill-emerald-500 animate-pulse" size={18} />
          <span className="font-extrabold text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-700">
            HEALTH CARE NETWORK
          </span>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500">v2.0 Stable</div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center flex-1 text-center z-10 relative">
        
        {/* Soft Radial Glow behind Main Heading */}
        <div className="absolute w-[580px] h-[340px] rounded-full bg-gradient-to-tr from-emerald-500/5 to-yellow-500/5 blur-[100px] pointer-events-none z-0 top-[20%] left-1/2 -translate-x-1/2" />

        {/* Hero Title (Premium Light Nature Text Gradient) */}
        <motion.h1 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight relative z-10"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-950 via-emerald-800 to-slate-900">Empowering Care,</span> <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Nurturing Elder Lives
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-slate-600 text-sm md:text-base max-w-xl mb-14 leading-relaxed font-semibold relative z-10"
        >
          A centralized, real-time collaboration network connecting Administrators, dedicated Care Helpers, and Elders for seamless medical tracking and urgent assistance.
        </motion.p>

        {/* Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 relative z-10"
        >
          
          {/* Admin Card (Blue Glass Theme) */}
          <div 
            onClick={(e) => handleCardClick(e, 'admin', '/admin/login')}
            onMouseMove={(e) => handleCardMouseMove(e, 'admin')}
            onMouseLeave={() => handleCardMouseLeave('admin')}
            style={{ 
              '--glow-color': 'rgba(59, 130, 246, 0.3)',
              ...tiltStyles.admin 
            }}
            className="group cursor-pointer border-glow-wrapper card-3d relative rounded-3xl p-8 bg-white/10 backdrop-blur-md border border-blue-500/20 flex flex-col items-center overflow-hidden mouse-glow-container shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:bg-white/20 transition-all duration-500"
          >
            {/* Mirror shine sweep reflection */}
            <div className="animate-shine-sweep" />

            {/* Click Ripple Wave */}
            {ripples.admin && (
              <span 
                className="ripple-wave" 
                style={{ left: ripples.admin.x, top: ripples.admin.y }} 
              />
            )}

            {/* Moving Gradient Border */}
            <div className="border-glow-element" />

            {/* Mouse-follow glow background */}
            <div className="mouse-glow-bg" />

            {/* Floating particles inside the card */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.08]">
              <div className="bg-particle text-blue-500 font-bold" style={{ left: '15%', top: '25%', '--duration': '7s', '--delay': '0s' }}>•</div>
              <div className="bg-particle text-blue-400 font-bold" style={{ left: '80%', top: '45%', '--duration': '9s', '--delay': '-2.5s' }}>•</div>
            </div>

            {/* Icon & Orbit Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              {/* Planetary Orbit Ring */}
              <div className="absolute w-[120%] h-[30%] transform rotate-[-25deg] pointer-events-none">
                <div className="w-full h-full border-2 border-blue-500/25 rounded-full group-hover:border-blue-500/50 transition-all duration-500" />
              </div>
              {/* Core Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-all duration-500 relative z-10 shadow-sm">
                <ShieldCheck size={24} />
              </div>
            </div>

            <h3 className="font-extrabold text-lg mb-2 text-slate-800 group-hover:text-blue-700 transition-colors z-10">Admin Portal</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mb-8 font-semibold z-10">
              Manage helpers, register elder patients, configure medicine schedules, and review audit logs.
            </p>
            
            {/* Animated Hover Arrow */}
            <div className="mt-auto flex items-center gap-1.5 text-blue-600 text-xs font-black z-10">
              <span>Access Portal</span>
              <ArrowRight size={14} className="transform translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
            </div>
          </div>

          {/* Helper Card (Emerald Glass Theme) */}
          <div 
            onClick={(e) => handleCardClick(e, 'helper', '/helper/login')}
            onMouseMove={(e) => handleCardMouseMove(e, 'helper')}
            onMouseLeave={() => handleCardMouseLeave('helper')}
            style={{ 
              '--glow-color': 'rgba(16, 185, 129, 0.3)',
              ...tiltStyles.helper 
            }}
            className="group cursor-pointer border-glow-wrapper card-3d relative rounded-3xl p-8 bg-white/10 backdrop-blur-md border border-emerald-500/20 flex flex-col items-center overflow-hidden mouse-glow-container shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:bg-white/20 transition-all duration-500"
          >
            {/* Mirror shine sweep reflection */}
            <div className="animate-shine-sweep" />

            {/* Click Ripple Wave */}
            {ripples.helper && (
              <span 
                className="ripple-wave" 
                style={{ left: ripples.helper.x, top: ripples.helper.y }} 
              />
            )}

            {/* Moving Gradient Border */}
            <div className="border-glow-element" />

            {/* Mouse-follow glow background */}
            <div className="mouse-glow-bg" />

            {/* Floating particles inside the card */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.08]">
              <div className="bg-particle text-emerald-500 font-bold" style={{ left: '15%', top: '25%', '--duration': '7s', '--delay': '0s' }}>•</div>
              <div className="bg-particle text-emerald-400 font-bold" style={{ left: '80%', top: '45%', '--duration': '9s', '--delay': '-2.5s' }}>•</div>
            </div>

            {/* Icon & Orbit Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              {/* Planetary Orbit Ring */}
              <div className="absolute w-[120%] h-[30%] transform rotate-[-25deg] pointer-events-none">
                <div className="w-full h-full border-2 border-emerald-500/25 rounded-full group-hover:border-emerald-500/50 transition-all duration-500" />
              </div>
              {/* Core Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:text-emerald-700 transition-all duration-500 relative z-10 shadow-sm">
                <HelpingHand size={24} />
              </div>
            </div>

            <h3 className="font-extrabold text-lg mb-2 text-slate-800 group-hover:text-emerald-700 transition-colors z-10">Helper Portal</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mb-8 font-semibold z-10">
              Check-in for shifts, track daily checklists, log elder vitals (BP, sugar), and manage leave availability.
            </p>
            
            {/* Animated Hover Arrow */}
            <div className="mt-auto flex items-center gap-1.5 text-emerald-600 text-xs font-black z-10">
              <span>Access Portal</span>
              <ArrowRight size={14} className="transform translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
            </div>
          </div>

          {/* Elder Card (Purple Glass Theme) */}
          <div 
            onClick={(e) => handleCardClick(e, 'elder', '/old-person/login')}
            onMouseMove={(e) => handleCardMouseMove(e, 'elder')}
            onMouseLeave={() => handleCardMouseLeave('elder')}
            style={{ 
              '--glow-color': 'rgba(168, 85, 247, 0.3)',
              ...tiltStyles.elder 
            }}
            className="group cursor-pointer border-glow-wrapper card-3d relative rounded-3xl p-8 bg-white/10 backdrop-blur-md border border-purple-500/20 flex flex-col items-center overflow-hidden mouse-glow-container shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:bg-white/20 transition-all duration-500"
          >
            {/* Mirror shine sweep reflection */}
            <div className="animate-shine-sweep" />

            {/* Click Ripple Wave */}
            {ripples.elder && (
              <span 
                className="ripple-wave" 
                style={{ left: ripples.elder.x, top: ripples.elder.y }} 
              />
            )}

            {/* Moving Gradient Border */}
            <div className="border-glow-element" />

            {/* Mouse-follow glow background */}
            <div className="mouse-glow-bg" />

            {/* Floating particles inside the card */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.08]">
              <div className="bg-particle text-purple-500 font-bold" style={{ left: '15%', top: '25%', '--duration': '7s', '--delay': '0s' }}>•</div>
              <div className="bg-particle text-purple-400 font-bold" style={{ left: '80%', top: '45%', '--duration': '9s', '--delay': '-2.5s' }}>•</div>
            </div>

            {/* Icon & Orbit Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              {/* Planetary Orbit Ring */}
              <div className="absolute w-[120%] h-[30%] transform rotate-[-25deg] pointer-events-none">
                <div className="w-full h-full border-2 border-purple-500/25 rounded-full group-hover:border-purple-500/50 transition-all duration-500" />
              </div>
              {/* Core Icon */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:text-purple-700 transition-all duration-500 relative z-10 shadow-sm">
                <Heart size={24} />
              </div>
            </div>

            <h3 className="font-extrabold text-lg mb-2 text-slate-800 group-hover:text-purple-700 transition-colors z-10">Elder Portal</h3>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mb-8 font-semibold z-10">
              View health charts, schedule appointments, chat with assigned helpers, and access emergency SOS services.
            </p>
            
            {/* Animated Hover Arrow */}
            <div className="mt-auto flex items-center gap-1.5 text-purple-600 text-xs font-black z-10">
              <span>Access Portal</span>
              <ArrowRight size={14} className="transform translate-x-[-6px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
            </div>
          </div>

        </motion.div>
      </main>

      {/* Footer Section */}
      <footer className="py-8 border-t border-emerald-100/20 text-center text-xs text-slate-550 z-10 bg-white/10">
        &copy; {new Date().getFullYear()} Health Care Network. All rights reserved. Designed for elder support and care excellence.
      </footer>
    </div>
  );
};

export default LandingPage;
