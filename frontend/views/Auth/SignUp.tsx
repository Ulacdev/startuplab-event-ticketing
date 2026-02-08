
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../../components/Shared';
import { ICONS } from '../../constants';
import { UserRole } from '../../types';

export const SignUpView: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API registration delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Account created successfully! Redirecting to login...');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center px-4">
      <div className="max-w-xl w-full py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#2E2E2F] tracking-tighter mb-3">
            Sign Up for <span className="text-[#38BDF2]">StartupLab</span>
          </h1>
          <p className="text-[#2E2E2F]/70 text-lg font-medium">Create your account</p>
        </div>

        <Card className="p-10 bg-[#F2F2F2] border border-[#2E2E2F]/20 rounded-[3rem]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Perspective Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#2E2E2F]/60 uppercase tracking-[0.3em] ml-1">Select Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.ADMIN)}
                  className={`min-h-[32px] px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-colors flex flex-col items-center gap-2 bg-[#38BDF2] text-[#F2F2F2] hover:bg-[#2E2E2F] hover:text-[#F2F2F2] ${role === UserRole.ADMIN ? 'ring-2 ring-[#2E2E2F] ring-offset-2 ring-offset-[#F2F2F2]' : 'opacity-70'
                    }`}
                >
                  <ICONS.Layout className="w-4 h-4" />
                  Administrator
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.STAFF)}
                  className={`min-h-[32px] px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-colors flex flex-col items-center gap-2 bg-[#38BDF2] text-[#F2F2F2] hover:bg-[#2E2E2F] hover:text-[#F2F2F2] ${role === UserRole.STAFF ? 'ring-2 ring-[#2E2E2F] ring-offset-2 ring-offset-[#F2F2F2]' : 'opacity-70'
                    }`}
                >
                  <ICONS.CheckCircle className="w-4 h-4" />
                  Event Staff
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Jordan Miller"
                required
                className="py-4 px-6 rounded-2xl bg-[#F2F2F2] border-[#2E2E2F]/20 focus:border-[#38BDF2]"
                value={formData.name}
                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Professional Email"
                type="email"
                placeholder="j.miller@organization.com"
                required
                className="py-4 px-6 rounded-2xl bg-[#F2F2F2] border-[#2E2E2F]/20 focus:border-[#38BDF2]"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Organization"
                placeholder="Company or Entity Name"
                required
                className="py-4 px-6 rounded-2xl bg-[#F2F2F2] border-[#2E2E2F]/20 focus:border-[#38BDF2]"
                value={formData.company}
                onChange={(e: any) => setFormData({ ...formData, company: e.target.value })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                className="py-4 px-6 rounded-2xl bg-[#F2F2F2] border-[#2E2E2F]/20 focus:border-[#38BDF2]"
                value={formData.password}
                onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <p className="text-center text-[#2E2E2F]/60 text-xs font-medium">
              By initializing, you agree to our <a href="#" className="text-[#2E2E2F] font-bold hover:text-[#38BDF2] hover:underline">Terms of Service</a>
            </p>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <button
            className="text-[#2E2E2F]/60 hover:text-[#38BDF2] transition-colors text-sm font-bold flex items-center justify-center gap-2 mx-auto"
            onClick={() => navigate('/login')}
          >
            Already have an account? <span className="text-[#2E2E2F] hover:text-[#38BDF2] hover:underline">Login to Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
