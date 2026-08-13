import React, { useState, useEffect } from 'react';
import { X, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const { sendOTP } = useAuth();
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber('+91');
      setOtp('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await sendOTP(phoneNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      onClose(); // Close modal on success! AuthContext will auto-sync with backend.
    } catch (err) {
      console.error(err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#f8f9fa] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-[#1c3a59]" />
          </div>
          <h2 className="text-2xl font-black text-[#1c3a59]">Welcome to SanCars</h2>
          <p className="text-sm font-medium text-gray-500 mt-2">Sign in to book premium rentals instantly</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm font-bold p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input 
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-4 text-lg font-bold text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors"
              />
            </div>
            
            <div id="recaptcha-container" className="mb-4"></div>

            <button 
              disabled={loading || phoneNumber.length < 10}
              type="submit"
              className="w-full bg-[#1c3a59] hover:bg-[#c88349] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              SEND OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-gray-500 mb-6">
                Enter the 6-digit code sent to <span className="font-bold text-[#1c3a59]">{phoneNumber}</span>
              </p>
              
              <input 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full text-center tracking-[1em] border-2 border-gray-100 rounded-xl px-4 py-4 text-2xl font-black text-[#1c3a59] focus:outline-none focus:border-[#c88349] transition-colors"
              />
            </div>

            <button 
              disabled={loading || otp.length !== 6}
              type="submit"
              className="w-full bg-[#c88349] hover:bg-[#b06f36] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              VERIFY & LOGIN
            </button>
            
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-[#1c3a59] uppercase tracking-wider transition-colors"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
