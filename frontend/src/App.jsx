import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import Contact from './pages/Contact';
import MyBookings from './pages/MyBookings';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import FleetManagement from './pages/admin/FleetManagement';
import Bookings from './pages/admin/Bookings';
import Customers from './pages/admin/Customers';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="fleet" element={<FleetManagement />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Routes>
      <WhatsAppButton />
    </Router>
  );
}

export default App;
