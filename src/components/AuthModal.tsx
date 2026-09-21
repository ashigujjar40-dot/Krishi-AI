import React, { useState } from 'react';
import { Phone, KeyRound, UserCheck, Store, Microscope, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole, LanguageCode, UserProfile } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface AuthModalProps {
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const t = I18N_TEXTS[language];

  const [role, setRole] = useState<UserRole>('farmer');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('4321');
  const [name, setName] = useState('Balwant Singh');
  const [pincode, setPincode] = useState('444001');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage(`OTP sent! (For quick demo test: 4321)`);
        setStep('otp');
      }
    } catch (err) {
      setOtpSentMessage(`Demo mode: Use OTP 4321`);
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp,
          role,
          name,
          pincode
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        alert(data.error || 'Invalid OTP. Use 4321');
      }
    } catch (err) {
      // Offline fallback login
      onLoginSuccess({
        id: role === 'dealer' ? 'dealer-101' : role === 'agronomist' ? 'agro-101' : 'farmer-101',
        phone,
        name,
        role,
        language,
        pincode
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              {t.appName}
            </span>
            <h3 className="text-base font-extrabold text-stone-900">
              {step === 'phone' ? t.loginOtp : t.verifyOtp}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="text-[11px] font-bold text-stone-600 block mb-1">
            Choose Your Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => {
                setRole('farmer');
                setName('Balwant Singh');
              }}
              className={`py-1.5 rounded-lg transition-all ${
                role === 'farmer' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              🧑‍🌾 Farmer
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('dealer');
                setName('Ramesh Patel');
              }}
              className={`py-1.5 rounded-lg transition-all ${
                role === 'dealer' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              🏬 Dealer
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('agronomist');
                setName('Dr. Sunita Sharma');
              }}
              className={`py-1.5 rounded-lg transition-all ${
                role === 'agronomist' ? 'bg-white text-emerald-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              🔬 Admin
            </button>
          </div>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Mobile Number (Phone OTP)</label>
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                <span className="font-bold text-stone-500 mr-2">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent outline-none font-bold text-stone-900"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Pincode (for nearest mandi/dealers)</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-none font-mono font-bold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? 'Sending OTP...' : t.sendOtp}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
            {otpSentMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-[11px] font-medium">
                {otpSentMessage}
              </div>
            )}

            <div>
              <label className="font-bold text-stone-700 block mb-1">Enter 4-Digit OTP</label>
              <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                <KeyRound className="w-4 h-4 text-emerald-600 mr-2" />
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent outline-none font-mono font-extrabold text-stone-900 text-lg tracking-widest text-center"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span>Mobile: +91 {phone}</span>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Change
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying...' : t.verifyOtp}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
