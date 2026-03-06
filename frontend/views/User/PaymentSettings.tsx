import React from 'react';
import { HitPayGatewaySettings } from '../../components/HitPayGatewaySettings';

export const PaymentSettings: React.FC = () => {
  return (
    <HitPayGatewaySettings
      scope="organizer"
      badgeLabel="Organizer Payouts"
      headline="Organizer HitPay Gateway"
      description="Connect the HitPay account that should receive revenue from your own paid events. Ticket buyers will check out through this account once backend routing is wired."
      ownerLabel="Organizer Account"
      usagePoints={[
        'Paid event ticket sales created under your organizer profile.',
        'Direct payout ownership for your event revenue instead of platform-level collection.',
        'Webhook verification using your stored HitPay salt before any booking is marked paid.',
        'Future event-specific payment extensions without changing the UI contract.',
      ]}
    />
  );
};
