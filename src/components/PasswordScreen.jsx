import React, { useState, useEffect, useRef } from 'react';
import { Lock, Smartphone, ChevronRight } from 'lucide-react';

const PasswordScreen = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const correctPassword = '0001';

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setPassword(value);
      setError(false);
      
      if (value.length === 4) {
        if (value === correctPassword) {
          setTimeout(() => {
            onAuthenticated();
          }, 300);
        } else {
          setError(true);
          setTimeout(() => setPassword(''), 500);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 font-sans">
      <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Logo or Icon */}
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-12 transition-transform hover:rotate-0 duration-300">
            <Lock className="text-white w-10 h-10" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Smartphone className="text-white w-4 h-4" />
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Check</h1>
          <p className="text-slate-400 text-sm">Enter the 4-digit passcode</p>
        </div>

        {/* Interactive Area with Password Dots */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className={`flex space-x-4 cursor-pointer p-8 rounded-2xl transition-all duration-300 hover:bg-white/5 ${error ? 'animate-shake' : ''}`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                password.length > i
                  ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-lg shadow-indigo-500/50'
                  : 'bg-transparent border-slate-700'
              } ${error ? 'border-red-500 bg-red-500' : ''}`}
            />
          ))}
        </div>

        {/* Invisible Input for Keyboard focus */}
        <input
          ref={inputRef}
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          autoFocus
          value={password}
          onChange={handleChange}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
        />
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-12 flex items-center space-x-2 text-slate-600 text-xs uppercase tracking-widest">
        <div className="w-1 h-1 bg-slate-700 rounded-full" />
        <span>Secure ETF Profit Note</span>
        <div className="w-1 h-1 bg-slate-700 rounded-full" />
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-in {
          animation: zoomIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PasswordScreen;
