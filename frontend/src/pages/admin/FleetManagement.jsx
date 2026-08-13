import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, UploadCloud, ChevronLeft, ChevronRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

function FleetManagement() {
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Live Preview State
  const [showPreviewCard, setShowPreviewCard] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats: 5,
    mileage: '',
    images: []
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

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      try {
        const compressedFiles = [];
        const previews = [];
        for (let i = 0; i < files.length; i++) {
          const compressedFile = await imageCompression(files[i], options);
          compressedFiles.push(compressedFile);
          previews.push(URL.createObjectURL(compressedFile));
        }
        setFormData(prev => ({ ...prev, [name]: compressedFiles }));
        setImagePreviews(previews);
      } catch (error) {
        console.error("Image compression error:", error);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['year', 'price_per_day', 'seats', 'mileage'].includes(name) ? Number(value) : value
      }));
    }
  };

  const moveImage = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === imagePreviews.length - 1)
    ) {
      return;
    }
    const newPreviews = [...imagePreviews];
    const newImages = [...formData.images];
    
    const tempPreview = newPreviews[index];
    newPreviews[index] = newPreviews[index + direction];
    newPreviews[index + direction] = tempPreview;
    
    const tempImage = newImages[index];
    newImages[index] = newImages[index + direction];
    newImages[index + direction] = tempImage;

    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newImages }));
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
        if (key === 'images') {
          if (formData.images && formData.images.length > 0) {
            formData.images.forEach(img => {
              data.append('images', img);
            });
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
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
        images: [] 
      });
      setImagePreviews(car.images ? car.images.map(img => img.startsWith('/') ? `http://localhost:8000${img}` : img) : []);
    } else {
      setEditingCar(null);
      setFormData({
        brand: '', model: '', year: new Date().getFullYear(),
        price_per_day: '', transmission: 'Automatic', fuel_type: 'Petrol',
        seats: 5, mileage: '', images: []
      });
      setImagePreviews([]);
    }
    setIsModalOpen(true);
  };

  const inputClass = "w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#c88349] focus:ring-4 focus:ring-[#c88349]/20 rounded-xl px-4 py-3 outline-none transition-all font-medium text-gray-800";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

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
          className="flex items-center gap-2 bg-[#c88349] hover:bg-[#b06f36] shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-lg font-bold transition-all"
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
                    <img src={car.images && car.images.length > 0 ? (car.images[0].startsWith('/') ? `http://localhost:8000${car.images[0]}` : car.images[0]) : ''} alt={car.model} className="w-16 h-12 rounded object-cover border border-gray-200" />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <div>
                <h2 className="text-2xl font-black text-[#1c3a59] tracking-tight">
                  {editingCar ? 'Edit Vehicle Profile' : 'Add New Vehicle'}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">Fill in the details below to update your fleet inventory.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2.5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className={labelClass}>Brand</label>
                  <input required name="brand" value={formData.brand} onChange={handleInputChange} type="text" className={inputClass} placeholder="e.g. Toyota" />
                </div>
                <div>
                  <label className={labelClass}>Model</label>
                  <input required name="model" value={formData.model} onChange={handleInputChange} type="text" className={inputClass} placeholder="e.g. Innova Crysta" />
                </div>
                <div>
                  <label className={labelClass}>Manufacturing Year</label>
                  <input required name="year" value={formData.year} onChange={handleInputChange} type="number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Price per day (₹)</label>
                  <input required name="price_per_day" value={formData.price_per_day} onChange={handleInputChange} type="number" className={inputClass} placeholder="e.g. 2500" />
                </div>
                <div>
                  <label className={labelClass}>Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange} className={inputClass}>
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Fuel Type</label>
                  <select name="fuel_type" value={formData.fuel_type} onChange={handleInputChange} className={inputClass}>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Seating Capacity</label>
                  <input required name="seats" value={formData.seats} onChange={handleInputChange} type="number" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mileage (km/l)</label>
                  <input required name="mileage" value={formData.mileage} onChange={handleInputChange} type="number" step="0.1" className={inputClass} />
                </div>
              </div>

              {/* Advanced Image Upload Section */}
              <div className="pt-4">
                <label className={labelClass}>Vehicle Images (Drag & Drop)</label>
                <div className="relative border-2 border-dashed border-gray-300 hover:border-[#c88349] rounded-2xl p-8 text-center bg-gray-50 hover:bg-[#c88349]/5 transition-all group cursor-pointer overflow-hidden">
                  <input 
                    required={!editingCar && formData.images.length === 0} 
                    name="images" 
                    onChange={handleInputChange} 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <UploadCloud className="w-8 h-8 text-[#c88349]" />
                    </div>
                    <div>
                      <div className="text-gray-800 font-bold text-lg">Click to browse or drag images here</div>
                      <div className="text-sm text-gray-500 font-medium mt-1">Supports multiple JPG, PNG. Will be automatically compressed.</div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Image Previews with Reordering */}
                {imagePreviews.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Image Previews ({imagePreviews.length})</h4>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        Compressed & Ready
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagePreviews.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-[4/3] bg-gray-100">
                          <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between px-2">
                            <button type="button" onClick={() => moveImage(idx, -1)} disabled={idx === 0} className="p-1 bg-white/80 hover:bg-white text-gray-800 rounded-full disabled:opacity-0 transition-all z-20">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button type="button" onClick={() => moveImage(idx, 1)} disabled={idx === imagePreviews.length - 1} className="p-1 bg-white/80 hover:bg-white text-gray-800 rounded-full disabled:opacity-0 transition-all z-20">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md z-30">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full shadow-lg border border-white/50 z-10 pointer-events-none">
                            {idx + 1}
                          </div>
                          {idx === 0 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#c88349] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md z-10 pointer-events-none">
                              PRIMARY
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100 mt-8">
                <button 
                  type="button" 
                  onClick={() => { setPreviewImageIndex(0); setShowPreviewCard(true); }} 
                  disabled={imagePreviews.length === 0} 
                  className="text-[#c88349] font-bold hover:text-[#b06f36] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Live Preview
                </button>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-8 py-3.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="w-full sm:w-auto px-10 py-3.5 bg-[#1c3a59] hover:bg-[#0f2439] shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white font-bold rounded-xl transition-all">
                    {editingCar ? 'Save Changes' : 'Publish Car'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewCard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="relative w-full max-w-[400px]">
            <button onClick={() => setShowPreviewCard(false)} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 font-sans">
              <div className="h-64 overflow-hidden relative group">
                <img 
                  src={imagePreviews.length > 0 ? imagePreviews[previewImageIndex] : ''} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                {imagePreviews.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <button onClick={() => setPreviewImageIndex(p => Math.max(0, p - 1))} className="p-1 bg-white/50 hover:bg-white text-gray-800 rounded-full shadow">
                       <ChevronLeft className="w-6 h-6" />
                     </button>
                     <button onClick={() => setPreviewImageIndex(p => Math.min(imagePreviews.length - 1, p + 1))} className="p-1 bg-white/50 hover:bg-white text-gray-800 rounded-full shadow">
                       <ChevronRight className="w-6 h-6" />
                     </button>
                  </div>
                )}
                {imagePreviews.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {imagePreviews.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === previewImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-8 pt-4 text-[#1c3a59]">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                  <div>
                    <h3 className="text-2xl font-black mb-1">{formData.brand || 'Brand'} {formData.model || 'Model'}</h3>
                    <p className="text-sm text-gray-400 font-medium">{formData.year} Model</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#c88349]">₹{formData.price_per_day || '0'}</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">per day</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {formData.transmission}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {formData.fuel_type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {formData.seats} Seats
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#c88349]"></span> {formData.mileage || '0'} km/l
                  </div>
                </div>

                <button className="w-full border-2 border-[#1c3a59] text-[#1c3a59] hover:bg-[#1c3a59] hover:text-white font-bold py-3 rounded-lg transition-colors">
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FleetManagement;
