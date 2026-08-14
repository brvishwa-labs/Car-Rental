import React, { useState, useEffect } from 'react';
import { FileText, Check, X } from 'lucide-react';

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bookings`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1c3a59]">Bookings Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Car</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold">#{booking.id}</td>
                  <td className="px-6 py-4">{booking.customer ? booking.customer.name : 'Unknown'}</td>
                  <td className="px-6 py-4">{booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unknown'}</td>
                  <td className="px-6 py-4">{booking.start_date} to {booking.end_date}</td>
                  <td className="px-6 py-4 font-bold text-[#c88349]">₹{booking.total_price?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      booking.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateStatus(booking.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateStatus(booking.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <p>No bookings available yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Bookings;
