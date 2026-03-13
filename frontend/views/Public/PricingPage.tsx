import React, { useEffect, useState } from 'react';
import { ICONS } from '../../constants';
import { AdminPlan } from '../../types';
import { apiService } from '../../services/apiService';
import { Button, Card, PageLoader } from '../../components/Shared';
import { PricingPlansGrid } from '../../components/PricingPlansGrid';
import { PlanBillingCycle } from '../../utils/pricingPlans';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export const PricingPage: React.FC = () => {
    const [plans, setPlans] = useState<AdminPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>('monthly');
    const navigate = useNavigate();
    const { isAuthenticated } = useUser();

    useEffect(() => {
        let active = true;

        const loadPlans = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await apiService.getPublicPlans();
                if (!active) return;
                setPlans(data);
            } catch (err: any) {
                if (!active) return;
                setError(err?.message || 'Failed to load pricing plans.');
                setPlans([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadPlans();
        return () => {
            active = false;
        };
    }, []);

    if (loading) return <PageLoader variant="page" label="Loading pricing plans..." />;

    return (
        <div className="bg-[#F2F2F2] min-h-screen">
            {/* Header: Admin-style alignment */}
            <div className="bg-gradient-to-r from-[#38BDF2] to-[#0EA5E9] py-16">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 mb-3">Pricing Plans</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
                        Simple & Transparent Pricing
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl font-medium">
                        Live plans below are synced from the admin subscription configuration. Choose the best path for your organization's growth.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-12 sm:-mt-16 pb-20 relative z-20">
                {error && (
                    <Card className="p-6 mb-8 border-[#2E2E2F]/10">
                        <p className="text-sm font-semibold text-[#2E2E2F]">{error}</p>
                    </Card>
                )}

                {!error && (
                    <PricingPlansGrid
                        plans={plans}
                        billingCycle={billingCycle}
                        onBillingCycleChange={setBillingCycle}
                        showBillingToggle
                        onPlanAction={() => {
                            if (!isAuthenticated) {
                                navigate('/signup');
                            } else {
                                navigate('/subscription');
                            }
                        }}
                    />
                )}

                <section className="mt-24 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-black text-[#2E2E2F] tracking-tight mb-4">
                            Need a tailored solution?
                        </h2>
                        <p className="text-[#2E2E2F]/60 mb-8 font-medium">
                            We offer customized volume pricing for organizations processing more than 500 tickets per month.
                            Our team is ready to help you optimize your event operations.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button variant="outline" className="w-full sm:w-auto px-8 border-[#2E2E2F] text-[#2E2E2F] hover:bg-[#2E2E2F] hover:text-[#F2F2F2]">
                                Schedule a Demo
                            </Button>
                            <Button variant="ghost" className="w-full sm:w-auto flex items-center gap-2 group text-[#2E2E2F] hover:text-[#38BDF2] font-black uppercase tracking-widest text-[10px]">
                                View detailed fee breakdown
                                <ICONS.ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
