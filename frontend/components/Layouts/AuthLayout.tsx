import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ 
          backgroundImage: 'url("/auth-bg.png")',
          transform: 'scale(1.05)'
        }}
      />
      
      {/* Blue Cinematic Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[#1E293B]/80 via-[#38BDF2]/40 to-[#1E293B]/80 backdrop-blur-[2px]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#38BDF2]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#38BDF2]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center">
          {/* Main Card Container */}
          <div className="w-full bg-white rounded-[40px] shadow-[0_32px_128px_-32px_rgba(30,41,59,0.5)] overflow-hidden border border-white/20">
            {children}
          </div>
          
          {/* Footer Back Link */}
          <button
            onClick={() => navigate('/')}
            className="mt-8 flex items-center gap-2 text-white/70 hover:text-white transition-all font-bold text-[11px] uppercase tracking-[0.2em] transform hover:-translate-x-1 active:scale-95 px-6 py-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Home
          </button>
        </div>
      </div>
    </div>
  );
};
