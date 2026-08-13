import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, car }) => {
  const { dbUser } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartDate('');
      setEndDate('');
      setError('');
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !car) return null;

  const handleValueChange = (newValue) => {
    setDateValue(newValue);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    if (diffTime < 0) return 0; // Invalid date range
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays; // Minimum 1 day
  };

  const days = calculateDays();
  const totalPrice = days * car.price_per_day;

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      setError('Please select both Pick-up and Drop-off dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('Drop-off date cannot be before Pick-up date.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: dbUser.id,
          car_id: car.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to create booking.');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error(err);
      setError('An error occurred while booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading && !success ? onClose : undefined}></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {!success && (
          <button 
            onClick={onClose}
            disabled={loading}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-[#1c3a59] mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 font-medium">Your reservation for the {car.brand} {car.model} has been received.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-[#1c3a59]" />
              </div>
              <h2 className="text-2xl font-black text-[#1c3a59]">Reserve Vehicle</h2>
              <p className="text-sm font-medium text-gray-500 mt-2">{car.brand} {car.model}</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <div className="mb-6 relative z-50 max-w-sm mx-auto">
              <div className="flex flex-col gap-5">
                <div className="w-full text-left">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors"
                    />
                  </div>
                </div>

                <div className="w-full text-left">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Drop-off Date
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={endDate}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {days > 0 && (
              <div className="bg-[#f8f9fa] rounded-2xl p-5 mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">Rate per day</span>
                  <span className="font-bold text-[#1c3a59]">₹{car.price_per_day}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-500">Duration</span>
                  <span className="font-bold text-[#1c3a59]">{days} {days === 1 ? 'Day' : 'Days'}</span>
                </div>
                <div className="h-px bg-gray-200 w-full my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
                  <span className="text-2xl font-black text-[#c88349]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <button 
              disabled={loading || !startDate || !endDate || days === 0}
              onClick={handleConfirm}
              className="w-full bg-[#1c3a59] hover:bg-[#c88349] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              CONFIRM BOOKING
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
