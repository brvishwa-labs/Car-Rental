import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import BookingModal from '../components/BookingModal';

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

const CarCard = ({ car, onReserve }) => {
  const [imageIndex, setImageIndex] = useState(0);
  
  // Backwards compatibility if some cars still have old `image` string instead of `images` array
  const images = car.images && car.images.length > 0 
    ? car.images 
    : (car.image ? [car.image] : []);

  const currentImage = images.length > 0 
    ? (images[imageIndex].startsWith('/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${images[imageIndex]}` : images[imageIndex]) 
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

        <button 
          onClick={() => onReserve(car)}
          className="w-full bg-[#f8f9fa] text-[#1c3a59] hover:bg-[#1c3a59] hover:text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm"
        >
          RESERVE NOW
        </button>
      </div>
    </div>
  );
};

function Cars() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Premium');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const { dbUser, logout } = useAuth();
  const [cars, setCars] = useState([]);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSeats = searchParams.get('seats') || 'All';

  const [filterSeats, setFilterSeats] = useState(initialSeats);
  const [filterFuel, setFilterFuel] = useState('All');
  const [filterMileage, setFilterMileage] = useState('All');

  const handleReserve = (car) => {
    if (!dbUser) {
      setIsLoginModalOpen(true);
    } else {
      setSelectedCar(car);
      setIsBookingModalOpen(true);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/cars`)
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
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img src="/SanCars.png" alt="SanCars Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            <div className="flex flex-col leading-none justify-center">
              <span className="text-2xl font-black tracking-widest text-[#1c3a59] mb-1">SANCARS</span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c88349]">PREMIUM RENTAL</span>
            </div>
          </Link>

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
            <Link to="/" className="hover:text-[#c88349] transition-colors">HOME</Link>
            <Link to="/cars" className="hover:text-[#c88349] transition-colors">CARS</Link>
            <Link to="/contact" className="hover:text-[#c88349] transition-colors">CONTACT</Link>
            
            {dbUser ? (
              <div className="relative group cursor-pointer">
                <div className="flex items-center gap-2 bg-[#f8f9fa] border-2 border-gray-100 px-5 py-2.5 rounded-full hover:border-[#c88349] transition-all">
                  <User className="w-4 h-4 text-[#c88349]" />
                  <span>{dbUser.name}</span>
                </div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden border border-gray-50">
                  <Link to="/my-bookings" className="block w-full text-left px-5 py-3 hover:bg-gray-50 text-[#1c3a59] font-semibold border-b border-gray-50">My Bookings</Link>
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
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedCar(null);
        }} 
        car={selectedCar} 
      />

      {/* Fleet Listing Area */}
      <section className="w-full bg-[#f8f9fa] relative z-10 pb-32">
        <div className="px-6 max-w-7xl mx-auto w-full">
          <FadeIn>
            <div className="text-center mb-10 md:mb-12 pt-8 md:pt-16">
              <h2 className="text-xs font-bold tracking-[0.3em] text-[#c88349] uppercase mb-4">The Collection</h2>
              <h3 className="text-4xl md:text-5xl font-black text-[#1c3a59] mb-6">Our {activeTab}</h3>
              <div className="w-24 h-1 bg-[#c88349] mx-auto rounded-full"></div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Seater</label>
                <select 
                  value={filterSeats}
                  onChange={(e) => setFilterSeats(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-2 py-2 text-sm md:text-base font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent cursor-pointer"
                >
                  <option value="All">All Seats</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="8+">8+ Seater</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fuel Type</label>
                <select 
                  value={filterFuel}
                  onChange={(e) => setFilterFuel(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-2 py-2 text-sm md:text-base font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent cursor-pointer"
                >
                  <option value="All">All Fuels</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="EV">EV / Hybrid</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mileage</label>
                <select 
                  value={filterMileage}
                  onChange={(e) => setFilterMileage(e.target.value)}
                  className="w-full border-b-2 border-gray-100 px-2 py-2 text-sm md:text-base font-medium text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors bg-transparent cursor-pointer"
                >
                  <option value="All">Any Mileage</option>
                  <option value="15">Up to 15 km/l</option>
                  <option value="15-20">15 - 20 km/l</option>
                  <option value="20+">20+ km/l</option>
                </select>
              </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {Array.isArray(cars) && cars.filter(car => {
              // Seat filter
              if (filterSeats !== 'All') {
                if (filterSeats === '8+' && car.seats < 8) return false;
                if (filterSeats !== '8+' && car.seats !== parseInt(filterSeats)) return false;
              }
              // Fuel filter
              if (filterFuel !== 'All' && car.fuel_type?.toLowerCase() !== filterFuel.toLowerCase() && !(filterFuel === 'EV' && car.fuel_type?.toLowerCase().includes('hybrid'))) return false;
              // Mileage filter
              if (filterMileage !== 'All') {
                if (filterMileage === '15' && car.mileage > 15) return false;
                if (filterMileage === '15-20' && (car.mileage < 15 || car.mileage > 20)) return false;
                if (filterMileage === '20+' && car.mileage < 20) return false;
              }
              return true;
            }).map((car, index) => (
              <FadeIn key={car.id} delay={index * 150}>
                <CarCard car={car} onReserve={handleReserve} />
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
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="flex flex-col items-center md:items-start justify-center">
              <img src="/SanCars.png" alt="SanCars Logo" className="h-12 w-auto mb-6 grayscale hover:grayscale-0 transition-all duration-300" />
              <p className="text-gray-500 font-medium text-sm text-center md:text-left mb-4">
                Premium car rental services in Pondicherry. We offer a wide range of luxury and comfortable vehicles for your journey.
              </p>
              <div className="text-sm font-bold text-[#1c3a59] mb-2">
                📍 2nd Floor, back to Bus stand, 118, Thiruvalluvar Salai, Sanjay Gandhi Nagar, Ilango Nagar, Puducherry, 605013
              </div>
              <div className="text-sm font-bold text-[#1c3a59]">
                📞 091711 22720
              </div>
            </div>
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.5540829018564!2d79.81278807608632!3d11.936089806572491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53617718f79903%3A0xe664bb7916b692b2!2sSAN%20CARS%20Self%20Drive%20Car%20Rental%20in%20Pondicherry!5e0!3m2!1sen!2sin!4v1786630559881!5m2!1sen!2sin" 
                width="100%" 
                height="250" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
                title="SanCars Location"
              ></iframe>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-gray-400 font-medium text-sm">
            <p>&copy; {new Date().getFullYear()} Sancars Premium Rental Pondicherry. Crafted with excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Cars;
