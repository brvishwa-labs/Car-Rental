import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

// Custom hook for scroll fade-in animation
function useIntersectionObserver(options = {}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (elementRef.current) observer.unobserve(elementRef.current);
      }
    }, { threshold: 0.1, ...options });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
}

const FadeIn = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useIntersectionObserver();
  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const CarCard = ({ car }) => {
  const [imageIndex, setImageIndex] = useState(0);
  
  // Backwards compatibility if some cars still have old `image` string instead of `images` array
  const images = car.images && car.images.length > 0 
    ? car.images 
    : (car.image ? [car.image] : []);

  const currentImage = images.length > 0 
    ? (images[imageIndex].startsWith('/') ? `http://localhost:8000${images[imageIndex]}` : images[imageIndex]) 
    : '';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group border border-gray-50 flex flex-col h-full">
      <div className="h-64 overflow-hidden relative p-4 bg-gray-50/50">
        <img 
          src={currentImage} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageIndex(p => Math.max(0, p - 1)); }} 
              className="p-1.5 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow pointer-events-auto z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImageIndex(p => Math.min(images.length - 1, p + 1)); }} 
              className="p-1.5 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow pointer-events-auto z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
            {images.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === imageIndex ? 'bg-[#1c3a59] shadow-sm' : 'bg-gray-300'}`}></div>
            ))}
          </div>
        )}

        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm">
          <span className="text-[#c88349] font-black tracking-wide text-sm">₹{car.price_per_day}</span>
          <span className="text-[10px] text-gray-500 font-bold uppercase ml-1">/ day</span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6 border-b border-gray-100 pb-6 flex-grow">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{car.brand}</p>
          <h4 className="text-2xl font-black text-[#1c3a59]">{car.model}</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 text-sm font-semibold text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#c88349] shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            {car.transmission}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#c88349] shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v8l9-11h-7z" /></svg>
            </div>
            {car.fuel_type}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#c88349] shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            {car.seats} Seats
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-[#c88349] shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            {car.mileage} km/l
          </div>
        </div>

        <button className="w-full bg-[#f8f9fa] text-[#1c3a59] hover:bg-[#1c3a59] hover:text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm">
          RESERVE NOW
        </button>
      </div>
    </div>
  );
};

function Home() {
  const [cars, setCars] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Premium');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { dbUser, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:8000/api/cars')
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1c3a59] font-sans w-full">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <img src="/SanCars.png" alt="SanCars Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            <div className="flex flex-col leading-none justify-center">
              <span className="text-2xl font-black tracking-widest text-[#1c3a59] mb-1">SANCARS</span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c88349]">PREMIUM RENTAL</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#1c3a59] hover:text-[#c88349] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Nav Links */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none p-6 md:p-0 gap-8 items-center text-sm font-bold tracking-wider text-[#1c3a59]`}>
            <a href="#" className="hover:text-[#c88349] transition-colors">HOME</a>
            <a href="#" className="hover:text-[#c88349] transition-colors">FLEET</a>
            <a href="#" className="hover:text-[#c88349] transition-colors">SERVICES</a>
            
            {dbUser ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 bg-[#f8f9fa] border-2 border-gray-100 px-5 py-2.5 rounded-full hover:border-[#c88349] transition-all">
                  <User className="w-4 h-4 text-[#c88349]" />
                  <span>{dbUser.name}</span>
                </div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden border border-gray-50">
                  <button className="w-full text-left px-5 py-3 hover:bg-gray-50 text-[#1c3a59] font-semibold border-b border-gray-50">My Bookings</button>
                  <button onClick={logout} className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-500 font-semibold">Sign Out</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#1c3a59] hover:bg-[#c88349] text-white px-8 py-3 rounded-full font-bold tracking-widest transition-colors shadow-lg shadow-[#1c3a59]/20 mt-4 md:mt-0 w-full md:w-auto text-xs"
              >
                SIGN IN
              </button>
            )}
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/Left Sun Beach.png" 
          alt="Pondicherry Beach" 
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle premium gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 z-10">
        {/* Hero Content */}
        <div className="relative z-10 text-center w-full max-w-5xl mx-auto pt-10">
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              Elevate Your Journey <br /> in Pondicherry
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-xl md:text-2xl font-light text-white/90 mb-16 drop-shadow-lg max-w-2xl mx-auto">
              Experience the perfect blend of luxury and comfort with our premium fleet.
            </p>
          </FadeIn>

          {/* Booking Widget */}
          <FadeIn delay={400} className="w-full mt-10 relative text-left">
            {/* Tabs */}
            <div className="flex justify-center md:justify-start px-4 md:px-0">
              <button 
                onClick={() => setActiveTab('Premium')}
                className={`px-10 py-4 rounded-t-2xl font-bold tracking-wider text-sm transition-all duration-300 ${activeTab === 'Premium' ? 'bg-white text-[#1c3a59] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
              >
                PREMIUM CARS
              </button>
              <button 
                onClick={() => setActiveTab('Scooters')}
                className={`px-10 py-4 rounded-t-2xl font-bold tracking-wider text-sm transition-all duration-300 ${activeTab === 'Scooters' ? 'bg-white text-[#1c3a59] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'} ml-2`}
              >
                SCOOTERS
              </button>
            </div>

            {/* Widget Body */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-6 items-center mx-4 md:mx-0 -mt-1 relative z-20">
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                <input 
                  type="text" 
                  placeholder="E.g. White Town" 
                  className="w-full border-b-2 border-gray-100 px-2 py-3 text-lg font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent"
                />
              </div>
              <div className="w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full border-b-2 border-gray-100 px-2 py-3 text-lg font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent"
                />
              </div>
              <div className="w-full border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vehicle Type</label>
                <select className="w-full border-b-2 border-gray-100 px-2 py-3 text-lg font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent cursor-pointer">
                  <option>All Types</option>
                  <option>Luxury SUV</option>
                  <option>Premium Sedan</option>
                  <option>Convertible</option>
                </select>
              </div>
              <div className="w-full md:w-auto pt-6 md:pt-0 md:pl-6">
                <button className="w-full md:w-auto bg-[#c88349] hover:bg-[#b06f36] text-white px-12 py-5 rounded-xl font-bold tracking-widest transition-all hover:shadow-xl hover:shadow-[#c88349]/30 whitespace-nowrap">
                  FIND VEHICLE
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Smooth Gradient Transition into Content Area */}
      <div className="relative z-10 w-full h-[50vh] bg-gradient-to-b from-transparent via-[#f8f9fa]/50 to-[#f8f9fa] pointer-events-none"></div>

      {/* Fleet Listing Area */}
      <section className="w-full bg-[#f8f9fa] relative z-10 pb-32">
        <div className="px-6 max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-20 pt-10">
              <h2 className="text-xs font-bold tracking-[0.3em] text-[#c88349] uppercase mb-4">The Collection</h2>
              <h3 className="text-4xl md:text-5xl font-black text-[#1c3a59] mb-6">Our {activeTab}</h3>
              <div className="w-24 h-1 bg-[#c88349] mx-auto rounded-full"></div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {Array.isArray(cars) && cars.map((car, index) => (
              <FadeIn key={car.id} delay={index * 150}>
                <CarCard car={car} />
              </FadeIn>
            ))}
            {cars.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                Loading the exclusive collection...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 text-center text-gray-400 font-medium text-sm w-full relative z-10">
        <div className="flex flex-col items-center justify-center">
          <img src="/SanCars.png" alt="SanCars Logo" className="h-10 w-auto opacity-50 mb-6 grayscale hover:grayscale-0 transition-all duration-300" />
          <p>&copy; {new Date().getFullYear()} Sancars Premium Rental Pondicherry. Crafted with excellence.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
