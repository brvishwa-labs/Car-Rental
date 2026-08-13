import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { dbUser, logout } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Note: Since this is just visual for now, we just show a success message.
    setTimeout(() => {
      setIsSubmitted(false);
      e.target.reset();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1c3a59] font-sans w-full flex flex-col">
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
            <Link to="/contact" className="text-[#c88349] transition-colors border-b-2 border-[#c88349] pb-1">CONTACT</Link>
            
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

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-8 pb-20 md:pt-16 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-xs font-bold tracking-[0.3em] text-[#c88349] uppercase mb-4">Get In Touch</h2>
          <h3 className="text-4xl md:text-5xl font-black text-[#1c3a59] mb-6">Contact Us</h3>
          <div className="w-24 h-1 bg-[#c88349] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-10">
            <h4 className="text-2xl font-black text-[#1c3a59] mb-8">We'd love to hear from you</h4>
            
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0 text-[#c88349]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h5 className="text-lg font-bold text-[#1c3a59] mb-2">Our Location</h5>
                <p className="text-gray-500 font-medium">2nd Floor, back to Bus stand, 118,<br />Thiruvalluvar Salai, Sanjay Gandhi Nagar,<br />Ilango Nagar, Puducherry, 605013</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0 text-[#c88349]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h5 className="text-lg font-bold text-[#1c3a59] mb-2">Phone Number</h5>
                <p className="text-gray-500 font-medium">+91 091711 22720</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0 text-[#c88349]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h5 className="text-lg font-bold text-[#1c3a59] mb-2">Email Address</h5>
                <p className="text-gray-500 font-medium">contact@sancars.in</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-50">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-2xl font-black text-[#1c3a59]">Message Sent!</h4>
                <p className="text-gray-500 font-medium">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input required type="text" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#c88349] focus:ring-4 focus:ring-[#c88349]/20 rounded-xl px-4 py-3 outline-none transition-all font-medium text-gray-800" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input required type="email" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#c88349] focus:ring-4 focus:ring-[#c88349]/20 rounded-xl px-4 py-3 outline-none transition-all font-medium text-gray-800" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input required type="tel" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#c88349] focus:ring-4 focus:ring-[#c88349]/20 rounded-xl px-4 py-3 outline-none transition-all font-medium text-gray-800" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea required rows="4" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#c88349] focus:ring-4 focus:ring-[#c88349]/20 rounded-xl px-4 py-3 outline-none transition-all font-medium text-gray-800 resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1c3a59] hover:bg-[#c88349] text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm shadow-lg hover:shadow-xl hover:-translate-y-1">
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 w-full mt-auto relative z-10">
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

export default Contact;
