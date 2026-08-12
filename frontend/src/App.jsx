import React, { useEffect, useState } from 'react';

function App() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/cars')
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch((err) => console.error("Error fetching cars:", err));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-teal-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md bg-neutral-900/80 sticky top-0 z-50 border-b border-neutral-800">
        <div className="text-2xl font-bold tracking-tighter text-teal-400">SanCars</div>
        <div className="space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-teal-400 transition-colors">Fleet</a>
          <a href="#" className="hover:text-teal-400 transition-colors">How it works</a>
          <a href="#" className="hover:text-teal-400 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 py-24 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-neutral-900 -z-10" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Drive the Coast. <br/> <span className="text-teal-400">Pondicherry in Style.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10">
          Premium self-drive car rentals with zero hidden fees. Explore the French Riviera of the East at your own pace.
        </p>
        <button className="bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold py-3 px-8 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          View Fleet
        </button>
      </section>

      {/* Fleet Listing */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Our Premium Fleet</h2>
          <div className="text-sm text-neutral-400">All rentals include 300km/day limit</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(cars) && cars.map((car) => (
            <div key={car.id} className="bg-neutral-800/50 border border-neutral-700 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors group">
              <div className="h-56 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={`${car.make} ${car.model}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
                    <p className="text-neutral-400 text-sm">{car.year}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-teal-400">₹{car.price_per_day}</div>
                    <div className="text-xs text-neutral-500">per day</div>
                  </div>
                </div>
                
                <div className="flex gap-4 mb-6 text-sm text-neutral-300">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-600"></span> {car.transmission}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-600"></span> {car.fuel_type}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neutral-600"></span> {car.seats} Seats
                  </div>
                </div>

                <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-3 rounded-xl transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
          {cars.length === 0 && (
            <div className="col-span-full py-10 text-center text-neutral-500">
              Loading our beautiful fleet...
            </div>
          )}
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-neutral-800 py-10 text-center text-neutral-500 text-sm">
        &copy; {new Date().getFullYear()} SanCars Pondicherry. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
