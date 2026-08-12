import React, { useEffect, useState } from 'react';

function App() {
  const [cars, setCars] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Premium');

  useEffect(() => {
    fetch('http://localhost:8000/api/cars')
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1c3a59] font-sans w-full">
      {/* Header */}
      <header className="bg-[#fcfdfd] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/SanCars.png" alt="SanCars Logo" className="h-14 w-auto object-contain" />
            <div className="flex flex-col leading-none justify-center">
              <span className="text-2xl font-black tracking-widest text-[#1c3a59] mb-1">SANCARS</span>
              <span className="text-[13px] font-bold tracking-[0.2em] text-[#c88349]">CAR RENTAL</span>
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
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-[#fcfdfd] md:bg-transparent shadow-lg md:shadow-none p-6 md:p-0 gap-6 md:gap-8 items-center text-base font-semibold text-[#1c3a59]`}>
            <a href="#" className="hover:text-[#c88349] transition-colors">Home</a>
            <a href="#" className="hover:text-[#c88349] transition-colors">Car Rental</a>
            <a href="#" className="hover:text-[#c88349] transition-colors">Premium</a>
            <button className="bg-[#c88349] hover:bg-[#b06f36] text-white px-7 py-2.5 rounded-full font-bold tracking-wide transition-colors shadow-sm mt-4 md:mt-0 w-full md:w-auto">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex flex-col items-center justify-start pt-20 px-6">
        {/* Background Image with Bottom Fade */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/Beach.png" 
            alt="Pondicherry Beach" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#f8f9fa] to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-[#1c3a59] mb-4 leading-tight tracking-tight shadow-white/50 drop-shadow-md">
            Explore Pondicherry <br /> Your Premium Ride
          </h1>
          <p className="text-lg md:text-xl font-medium text-[#1c3a59] mb-12 drop-shadow-sm">
            Drive with a Landmark Style Today
          </p>

          {/* Booking Widget */}
          <div className="w-full max-w-5xl mx-auto mt-20 relative text-left">
            {/* Tabs */}
            <div className="flex">
              <button 
                onClick={() => setActiveTab('Premium')}
                className={`px-8 py-3 rounded-t-xl font-bold text-sm ${activeTab === 'Premium' ? 'bg-white text-[#c88349] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]' : 'bg-[#e5e7eb] text-gray-500 hover:bg-gray-200'} transition-colors`}
              >
                Premium Cars
              </button>
              <button 
                onClick={() => setActiveTab('Scooters')}
                className={`px-8 py-3 rounded-t-xl font-bold text-sm ${activeTab === 'Scooters' ? 'bg-white text-[#c88349] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]' : 'bg-[#e5e7eb] text-gray-500 hover:bg-gray-200'} transition-colors`}
              >
                Scooters
              </button>
            </div>

            {/* Widget Body */}
            <div className="bg-white p-6 md:p-8 rounded-b-xl rounded-tr-xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
              <input 
                type="text" 
                placeholder="Pick-up Location (e.g. White Town)" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349]"
              />
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349]"
              />
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] bg-white">
                <option>All Types</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Convertible</option>
              </select>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] bg-white">
                <option>Any Pricing</option>
                <option>Below ₹2000</option>
                <option>₹2000 - ₹5000</option>
                <option>Above ₹5000</option>
              </select>
              <button className="w-full md:w-auto bg-[#c88349] hover:bg-[#b06f36] text-white px-10 py-3 rounded-lg font-bold tracking-wider transition-colors shadow-md whitespace-nowrap">
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Listing Area (Kept minimal to match vibe, replacing old grid) */}
      <section className="px-6 pt-40 pb-24 max-w-7xl mx-auto w-full relative z-10 bg-[#f8f9fa]">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1c3a59] mb-4">Our Available {activeTab}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Select from our wide range of premium vehicles for your perfect Pondicherry getaway.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.isArray(cars) && cars.map((car) => (
            <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-gray-100">
              <div className="h-64 overflow-hidden relative p-4">
                <img 
                  src={car.image} 
                  alt={`${car.make} ${car.model}`} 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 pt-4">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#1c3a59] mb-1">{car.make} {car.model}</h3>
                    <p className="text-sm text-gray-400 font-medium">{car.year} Model</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#c88349]">₹{car.price_per_day}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">per day</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm font-semibold text-[#1c3a59]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {car.transmission}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {car.fuel_type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {car.seats} Seats
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> AC
                  </div>
                </div>

                <button className="w-full border-2 border-[#1c3a59] text-[#1c3a59] hover:bg-[#1c3a59] hover:text-white font-bold py-3 rounded-lg transition-colors">
                  BOOK NOW
                </button>
              </div>
            </div>
          ))}
          {cars.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 font-medium">
              Loading our beautiful fleet...
            </div>
          )}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 py-12 text-center text-gray-500 font-medium text-sm bg-white w-full">
        &copy; {new Date().getFullYear()} Sancars Car Rental Pondicherry. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
