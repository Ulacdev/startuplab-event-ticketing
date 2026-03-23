import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, PasswordInput } from '../../components/Shared';
import { useToast } from '../../context/ToastContext';
import { ICONS } from '../../constants';

const API = import.meta.env.VITE_API_BASE;

export const SignUpView: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      showToast('error', msg);
      return;
    }
    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      showToast('error', msg);
      return;
    }
    if (!formData.name.trim()) {
      const msg = 'Name is required.';
      setError(msg);
      showToast('error', msg);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.message || 'Failed to create account.';
        setError(msg);
        showToast('error', msg);
        setIsSubmitting(false);
        return;
      }

      const msg = data.message || 'Account created. Verify your email, then continue setup.';
      showToast('success', msg);
      navigate('/login', { replace: true });
    } catch (err: any) {
      const msg = err?.message || 'Failed to create account.';
      setError(msg);
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 overflow-hidden bg-[#F2F2F2]">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 rounded-full text-[#2E2E2F]/40 hover:text-[#38BDF2] hover:bg-white shadow-sm transition-all group"
        title="Go to Home"
      >
        <ICONS.Home className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full relative z-10 scale-[0.75] sm:scale-90 md:scale-100 origin-center flex flex-col items-center">
        <Card className="p-6 sm:p-10 border-[#2E2E2F]/10 border-[5px] flex flex-col w-full bg-[#F2F2F2] shadow-2xl rounded-3xl overflow-hidden">
          <div className="text-center flex flex-col items-center mb-5">
            <img
              src="https://xmjdcbzgdfylbqkjoyyb.supabase.co/storage/v1/object/public/startuplab-business-ticketing/assets/assets/image%20(1).svg"
              alt="StartupLab Business Center Logo"
              className="mx-auto mb-3 w-[150px] lg:w-[180px] max-w-full h-auto"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-[#2E2E2F]/70 text-[14px] font-medium">Create your account</p>
            <div className="w-16 h-1 bg-[#38BDF2] mx-auto mt-2 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-3">
              <div className="space-y-1 w-full">
                <label className="block text-[11px] font-bold text-[#2E2E2F]/70 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E2E2F]/40 group-focus-within/input:text-[#38BDF2] transition-colors z-10">
                    <ICONS.Users className="w-4 h-4" />
                  </div>
                  <input
                    placeholder="e.g. John Doe"
                    required
                    value={formData.name}
                    onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-2 bg-[#F2F2F2] border border-[#2E2E2F]/10 rounded-2xl text-[#2E2E2F] placeholder-[#2E2E2F]/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF2]/40 focus:border-[#38BDF2] transition-colors font-semibold text-[13px]"
                  />
                </div>
              </div>

              <div className="space-y-1 w-full">
                <label className="block text-[11px] font-bold text-[#2E2E2F]/70 uppercase tracking-wider ml-1">Email</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2E2E2F]/40 group-focus-within/input:text-[#38BDF2] transition-colors z-10">
                    <ICONS.Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-2 bg-[#F2F2F2] border border-[#2E2E2F]/10 rounded-2xl text-[#2E2E2F] placeholder-[#2E2E2F]/40 focus:outline-none focus:ring-2 focus:ring-[#38BDF2]/40 focus:border-[#38BDF2] transition-colors font-semibold text-[13px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#2E2E2F]/70 uppercase tracking-wider ml-1">Password</label>
                  <PasswordInput
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                    icon={<ICONS.Lock className="w-4 h-4" />}
                    className="!rounded-2xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#2E2E2F]/70 uppercase tracking-wider ml-1">Confirm</label>
                  <PasswordInput
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    icon={<ICONS.Lock className="w-4 h-4" />}
                    className="!rounded-2xl"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-[13px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#38BDF2]/20 rounded-2xl mt-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            {error && (
              <div className="mt-1 p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-bold text-center">
                {error}
              </div>
            )}
          </form>

          <div className="mt-5 pt-5 border-t border-[#2E2E2F]/10 text-center">
            <p className="text-[#2E2E2F]/60 text-[12px] font-medium">
              Already have an account?{' '}
              <button
                className="text-[#38BDF2] font-black hover:text-[#2E2E2F] transition-colors ml-1"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
};




