import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

function FleetManagement() {
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    mileage: '',
    image: null
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/cars');
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Failed to fetch cars", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['year', 'price_per_day', 'seats', 'mileage'].includes(name) ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCar 
        ? `http://localhost:8000/api/cars/${editingCar.id}`
        : 'http://localhost:8000/api/cars';
        
      const method = editingCar ? 'PUT' : 'POST';

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(url, {
        method,
        body: data
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingCar(null);
        fetchCars();
      }
    } catch (error) {
      console.error("Failed to save car", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/cars/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchCars();
        }
      } catch (error) {
        console.error("Failed to delete car", error);
      }
    }
  };

  const openModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price_per_day: car.price_per_day,
        transmission: car.transmission,
        fuel_type: car.fuel_type,
        seats: car.seats,
        mileage: car.mileage,
        image: null // For editing, we only upload a new file if provided
      });
    } else {
      setEditingCar(null);
      setFormData({
        brand: '', model: '', year: new Date().getFullYear(),
        price_per_day: '', transmission: 'Automatic', fuel_type: 'Petrol',
        seats: 5, mileage: '', image: null
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search cars..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349]"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#c88349] hover:bg-[#b06f36] text-white px-5 py-2.5 rounded-lg font-bold transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Car
        </button>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Car Details</th>
                <th className="px-6 py-4">Specs</th>
                <th className="px-6 py-4">Price/Day</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <tr key={car.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img src={car.image?.startsWith('/') ? `http://localhost:8000${car.image}` : car.image} alt={car.model} className="w-16 h-12 rounded object-cover border border-gray-200" />
                    <div>
                      <div className="font-bold text-[#1c3a59] text-base">{car.brand} {car.model}</div>
                      <div className="text-xs text-gray-400">{car.year} Model</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span>{car.transmission} • {car.fuel_type}</span>
                      <span className="text-xs text-gray-400">{car.seats} Seats • {car.mileage} km/l</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#c88349]">
                    ₹{car.price_per_day}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openModal(car)} className="p-2 text-gray-400 hover:text-[#1c3a59] transition-colors rounded-lg hover:bg-gray-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(car.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No cars found. Click "Add New Car" to build your fleet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-[#1c3a59]">
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input required name="brand" value={formData.brand} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input required name="model" value={formData.model} onChange={handleInputChange} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input required name="year" value={formData.year} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per day (₹)</label>
                  <input required name="price_per_day" value={formData.price_per_day} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none bg-white">
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                  <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none bg-white">
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                  <input required name="seats" value={formData.seats} onChange={handleInputChange} type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km/l)</label>
                  <input required name="mileage" value={formData.mileage} onChange={handleInputChange} type="number" step="0.1" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                  <input 
                    required={!editingCar} 
                    name="image" 
                    onChange={handleInputChange} 
                    type="file" 
                    accept="image/*" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#c88349] focus:ring-1 focus:ring-[#c88349] outline-none" 
                  />
                  {editingCar && <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing image.</p>}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#1c3a59] hover:bg-[#2a4d70] text-white font-medium rounded-lg transition-colors">
                  {editingCar ? 'Save Changes' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FleetManagement;
