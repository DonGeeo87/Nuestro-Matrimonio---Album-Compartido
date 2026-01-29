
import React from 'react';
import { Heart, MapPin, Calendar } from 'lucide-react';

interface HeroProps {
  onEnter: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay - Using an image that represents the rustic elegance of Casa de Campo Raulif */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 flex flex-col items-center">
        <div className="mb-6 animate-pulse">
          <Heart className="w-14 h-14 text-rose-400 fill-rose-400/30" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase mb-6 opacity-90 drop-shadow-sm">
          Nuestra Boda
        </h2>
        
        <h1 className="text-7xl md:text-9xl font-cursive mb-10 drop-shadow-2xl">
          Rocío & Matías
        </h1>
        
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mb-10"></div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-16 text-lg md:text-xl font-serif italic opacity-95">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5 text-rose-300" />
            <span>28 de Febrero, 2026</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <MapPin className="w-5 h-5 text-rose-300" />
            <span>Casa de Campo Raulif</span>
          </div>
        </div>
        
        <button 
          onClick={onEnter}
          className="group relative px-10 py-5 bg-rose-500/80 backdrop-blur-md border border-rose-400/50 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white hover:text-rose-600 transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-rose-900/20"
        >
          Entrar al Álbum
        </button>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-12 left-12 w-40 h-40 border-t border-l border-white/30 hidden lg:block"></div>
      <div className="absolute bottom-12 right-12 w-40 h-40 border-b border-r border-white/30 hidden lg:block"></div>
    </div>
  );
};

export default Hero;
