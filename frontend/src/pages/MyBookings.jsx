import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, ChevronRight } from 'lucide-react';

export default function MyBookings() {
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser) {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [dbUser, navigate]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bookings?customer_id=${dbUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.reverse()); // Show newest first
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (!dbUser) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <img src="/SanCars.png" alt="SanCars Logo" className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            <div className="flex flex-col leading-none justify-center">
              <span className="text-2xl font-black tracking-widest text-[#1c3a59] mb-1">SANCARS</span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c88349]">PREMIUM RENTAL</span>
            </div>
          </Link>
          <Link to="/" className="text-sm font-bold text-[#1c3a59] hover:text-[#c88349] transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-[#1c3a59] tracking-tight">My Bookings</h1>
          <p className="text-gray-500 font-medium mt-2">Manage and track your premium rentals</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c3a59]"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#1c3a59] mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-8">You haven't made any reservations yet.</p>
            <Link to="/cars" className="inline-block bg-[#1c3a59] text-white px-8 py-4 rounded-xl font-bold tracking-widest text-sm hover:bg-[#c88349] transition-colors">
              BROWSE FLEET
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-6">
                  {booking.car?.images && booking.car.images.length > 0 ? (
                    <img src={booking.car.images[0]} alt={booking.car.brand} className="w-24 h-16 md:w-32 md:h-20 object-cover rounded-xl" />
                  ) : (
                    <div className="w-24 h-16 md:w-32 md:h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold tracking-widest text-[#c88349] uppercase">
                        {booking.car?.brand || 'Unknown'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#1c3a59]">
                      {booking.car?.model || 'Car Unavailable'}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                      {' - '}
                      {new Date(booking.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</span>
                    <span className="text-xl font-black text-[#1c3a59]">₹{booking.total_price?.toLocaleString() || 0}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
