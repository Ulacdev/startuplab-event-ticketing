import React, { useEffect, useState } from 'react';
import { ICONS } from '../../constants';
import { apiService } from '../../services/apiService';
import { AdminPlan } from '../../types';
import { Button, Card, PageLoader } from '../../components/Shared';

type CurrentSubscription = {
  subscription: any;
  plan: AdminPlan;
  billingInterval: string;
  status: string;
  endDate: string;
};

export const OrganizerSubscription: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subData, plansData] = await Promise.all([
        apiService.getCurrentSubscription(),
        apiService.getSubscriptionPlans()
      ]);

      if (subData.subscription) {
        setCurrentSubscription({
          subscription: subData.subscription,
          plan: subData.subscription.plan,
          billingInterval: subData.subscription.billingInterval,
          status: subData.subscription.status,
          endDate: subData.subscription.endDate
        });
      }

      setAvailablePlans(plansData);
    } catch (error: any) {
      setNotification({ type: 'error', message: error?.message || 'Failed to load subscription data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: AdminPlan) => {
    try {
      setSubscribing(plan.planId);
      const result = await apiService.createSubscription(plan.planId, billingCycle);

      if (result.free) {
        setNotification({ type: 'success', message: `Successfully subscribed to ${plan.name}!` });
        await loadData();
      } else if (result.paymentUrl) {
        // Redirect to HitPay payment
        window.location.href = result.paymentUrl;
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error?.message || 'Failed to create subscription' });
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription?.subscription?.subscriptionId) return;
    if (!window.confirm('Are you sure you want to cancel your subscription? This will immediately revoke your plan features.')) return;

    try {
      await apiService.cancelSubscription(currentSubscription.subscription.subscriptionId);
      setNotification({ type: 'success', message: 'Subscription has been cancelled and features have been revoked.' });
      setCurrentSubscription(null); // Clear local state immediately for better UX
      await loadData();
    } catch (error: any) {
      setNotification({ type: 'error', message: error?.message || 'Failed to cancel subscription' });
    }
  };

  if (loading) {
    return <PageLoader variant="page" label="Loading subscription..." />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      {notification && (
        <div className="fixed top-20 right-4 z-50">
          <Card className={`px-5 py-4 rounded-2xl border ${notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
            <p className="font-bold text-sm">{notification.message}</p>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] py-12">
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-3xl font-black text-white mb-2">Subscription</h1>
          <p className="text-white/80">Manage your plan and billing</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 -mt-8">
        {/* Current Plan */}
        {currentSubscription && (
          <Card className="mb-8 p-8 rounded-3xl border-[#2E2E2F]/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black text-[#38BDF8] uppercase tracking-widest mb-2">Current Plan</p>
                <h2 className="text-2xl font-black text-[#2E2E2F] mb-1">{currentSubscription.plan.name}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentSubscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {currentSubscription.status === 'active' ? 'Active' : currentSubscription.status}
                  </span>
                  <span className="text-sm text-[#2E2E2F]/60">
                    {currentSubscription.billingInterval === 'yearly' ? 'Yearly' : 'Monthly'} billing
                  </span>
                </div>
                {currentSubscription.endDate && (
                  <p className="text-sm text-[#2E2E2F]/50 mt-2">
                    {currentSubscription.subscription.cancelAtPeriodEnd
                      ? `Cancels on ${new Date(currentSubscription.endDate).toLocaleDateString()}`
                      : `Renews on ${new Date(currentSubscription.endDate).toLocaleDateString()}`
                    }
                  </p>
                )}
              </div>
              {!currentSubscription.subscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="!border-red-300 !text-red-500 hover:!bg-red-50"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>

            {/* Current Plan Features */}
            <div className="mt-8 pt-8 border-t border-[#2E2E2F]/10">
              <p className="text-xs font-black text-[#2E2E2F]/40 uppercase tracking-widest mb-4">Your Plan Includes</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Events', val: currentSubscription.plan.limits?.max_total_events || currentSubscription.plan.limits?.max_events || 0 },
                  { label: 'Active Events', val: currentSubscription.plan.limits?.max_active_events || currentSubscription.plan.limits?.max_events || 0 },
                  { label: 'Staff Accounts', val: currentSubscription.plan.limits?.max_staff_accounts || 0 },
                  { label: 'Monthly Attendees', val: currentSubscription.plan.limits?.monthly_attendees || currentSubscription.plan.limits?.max_attendees_per_month || 0 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#F2F2F2] rounded-2xl p-4">
                    <p className="text-2xl font-black text-[#2E2E2F]">{item.val}</p>
                    <p className="text-xs text-[#2E2E2F]/50 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* No Subscription */}
        {!currentSubscription && (
          <Card className="mb-8 p-8 rounded-3xl border-[#2E2E2F]/10 bg-gradient-to-r from-[#38BDF8]/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#38BDF8]/20 flex items-center justify-center">
                <ICONS.CreditCard className="w-8 h-8 text-[#38BDF8]" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#2E2E2F]">No Active Subscription</h2>
                <p className="text-[#2E2E2F]/60">Subscribe to a plan to unlock full features</p>
              </div>
            </div>
          </Card>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#38BDF8] text-white' : 'bg-white text-[#2E2E2F] hover:bg-[#F2F2F2]'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#38BDF8] text-white' : 'bg-white text-[#2E2E2F] hover:bg-[#F2F2F2]'}`}
          >
            Yearly
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Save 20%</span>
          </button>
        </div>

        {/* Available Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {availablePlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan?.planId === plan.planId;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

            return (
              <div key={plan.planId} className="relative group h-full">
                {plan.isRecommended && (
                  <div className="absolute -top-4 left-10 z-10 animate-in slide-in-from-top-4 duration-700">
                    <span className="bg-[#38BDF8] text-[#F2F2F2] px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/30 border border-white/20 flex items-center gap-2">
                      <ICONS.CheckCircle className="w-3.5 h-3.5" />
                      Recommended
                    </span>
                  </div>
                )}

                <Card className={`h-full flex flex-col border-[#2E2E2F]/10 rounded-[2.5rem] bg-[#F2F2F2] transition-all duration-500 hover:shadow-2xl hover:shadow-[#2E2E2F]/10 ${plan.isRecommended ? 'ring-2 ring-[#38BDF8] ring-offset-4 ring-offset-[#F2F2F2]' : ''}`}>
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-[#2E2E2F] tracking-tighter mb-2 uppercase leading-none">{plan.name}</h3>
                        {isCurrentPlan && (
                          <div className="bg-[#38BDF8] text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest inline-block">Current Plan</div>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center shadow-inner">
                        <ICONS.CreditCard className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[#2E2E2F] tracking-tighter">
                          ₱{Number(price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black text-[#2E2E2F]/30 uppercase tracking-[0.2em]">
                          / {billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      {plan.trialDays !== undefined && plan.trialDays > 0 && billingCycle === 'yearly' && (
                        <div className="flex items-center gap-2 mt-3">
                          <div className="bg-[#38BDF8]/10 text-[#38BDF8] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                            <ICONS.Calendar className="w-3 h-3" />
                            {plan.trialDays} Day Free Trial
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-[13px] text-[#2E2E2F]/60 font-bold leading-relaxed mb-10 min-h-[3rem] text-balance tracking-tight">
                      {plan.description}
                    </p>

                    <div className="space-y-10 mt-auto">
                      <div>
                        <label className="block text-[9px] font-black text-[#2E2E2F]/30 uppercase tracking-[0.2em] mb-4 ml-1">Plan Features</label>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { label: 'Custom Branding', enabled: (plan.features as any)?.enable_custom_branding || (plan.features as any)?.custom_branding },
                            { label: 'Discount Codes', enabled: (plan.features as any)?.discount_codes || (plan.features as any)?.enable_discount_codes },
                            { label: 'Advanced Reports', enabled: (plan.features as any)?.advanced_reports || (plan.features as any)?.enable_advanced_reports },
                            { label: 'Priority Support', enabled: (plan.features as any)?.priority_support || (plan.features as any)?.enable_priority_support },
                          ].map((feature, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[#F2F2F2]/50 border border-[#2E2E2F]/5 group/feat transition-all hover:border-[#38BDF8]/30 hover:shadow-sm">
                              <span className={`text-[11px] font-black uppercase tracking-widest ${feature.enabled ? 'text-[#2E2E2F]' : 'text-[#2E2E2F]/30'}`}>{feature.label}</span>
                              {feature.enabled ? (
                                <div className="w-6 h-6 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center">
                                  <ICONS.CheckCircle className="w-4 h-4" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-lg bg-[#2E2E2F]/5 text-[#2E2E2F]/20 flex items-center justify-center">
                                  <ICONS.XCircle className="w-4 h-4" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black text-[#2E2E2F]/30 uppercase tracking-[0.2em] mb-4 ml-1">Plan Limits</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Total Events', val: plan.limits?.max_total_events || plan.limits?.max_events || 0, icon: <ICONS.Box /> },
                            { label: 'Active Events', val: plan.limits?.max_active_events || plan.limits?.max_events || 0, icon: <ICONS.CheckCircle /> },
                            { label: 'Staff Accounts', val: plan.limits?.max_staff_accounts || 0, icon: <ICONS.Users /> },
                            { label: 'Monthly Attendees', val: plan.limits?.monthly_attendees || plan.limits?.max_attendees_per_month || 0, icon: <ICONS.Users /> },
                          ].map((limit, idx) => (
                            <div key={idx} className="p-4 bg-[#F2F2F2]/50 rounded-2xl border border-[#2E2E2F]/5 hover:border-[#38BDF8]/30 transition-all group/limit hover:shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-[#38BDF8] w-4 h-4 opacity-70 group-hover/limit:opacity-100 transition-opacity">
                                  {React.cloneElement(limit.icon as React.ReactElement<any>, { className: 'w-full h-full', strokeWidth: 3 })}
                                </div>
                                <span className="text-[16px] font-black text-[#2E2E2F] tracking-tighter leading-none">{limit.val}</span>
                              </div>
                              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#38BDF8]/50">{limit.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-10 py-8 bg-[#F2F2F2]/50 border-t border-[#2E2E2F]/5 rounded-b-[2.5rem]">
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isCurrentPlan || subscribing === plan.planId}
                      className={`w-full rounded-2xl py-4 font-black text-[11px] uppercase tracking-[0.2em] ${isCurrentPlan ? '!bg-green-500 !text-white opacity-100' : 'shadow-2xl shadow-[#38BDF8]/30'}`}
                    >
                      {subscribing === plan.planId
                        ? 'Processing...'
                        : isCurrentPlan
                          ? 'Current Plan'
                          : plan.monthlyPrice === 0
                            ? 'Get Started Free'
                            : 'Subscribe Now'
                      }
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
