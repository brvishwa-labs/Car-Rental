import React, { useEffect, useState } from 'react';
import { CarFront, FileText, DollarSign, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    activeRentals: 0,
    pendingBookings: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/stats')
      .then(res => res.json())
      .then(data => setStats({
        totalCars: data.total_cars,
        activeRentals: data.active_rentals,
        pendingBookings: data.pending_bookings,
        revenue: data.total_revenue,
      }))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  const statCards = [
    { title: 'Total Cars', value: stats.totalCars, icon: CarFront, color: 'bg-blue-500' },
    { title: 'Active Rentals', value: stats.activeRentals, icon: Activity, color: 'bg-green-500' },
    { title: 'Pending Bookings', value: stats.pendingBookings, icon: FileText, color: 'bg-yellow-500' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-[#c88349]' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-[#1c3a59]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-[#1c3a59] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/admin/fleet" className="w-full flex items-center justify-center gap-2 bg-[#1c3a59] hover:bg-[#2a4d70] text-white px-4 py-3 rounded-lg font-medium transition-colors">
              <CarFront className="w-4 h-4" /> Add New Car
            </Link>
            <button className="w-full flex items-center justify-center gap-2 bg-[#f8f9fa] border border-gray-200 hover:bg-gray-100 text-[#1c3a59] px-4 py-3 rounded-lg font-medium transition-colors">
              <FileText className="w-4 h-4" /> Review Bookings
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-[#1c3a59] mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Customer</th>
                  <th className="px-4 py-3">Car</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-4 font-medium text-[#1c3a59]">Rahul Sharma</td>
                  <td className="px-4 py-4">Hyundai Creta</td>
                  <td className="px-4 py-4">Oct 12 - Oct 15</td>
                  <td className="px-4 py-4"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span></td>
                  <td className="px-4 py-4"><button className="text-[#c88349] font-medium hover:underline">Review</button></td>
                </tr>
                <tr className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-4 font-medium text-[#1c3a59]">Priya Patel</td>
                  <td className="px-4 py-4">Honda City</td>
                  <td className="px-4 py-4">Oct 10 - Oct 12</td>
                  <td className="px-4 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Approved</span></td>
                  <td className="px-4 py-4"><button className="text-[#c88349] font-medium hover:underline">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
