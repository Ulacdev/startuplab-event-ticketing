import React from 'react';
import { HitPayGatewaySettings } from '../../components/HitPayGatewaySettings';

export const AdminPaymentSettings: React.FC = () => {
  return (
    <HitPayGatewaySettings
      scope="admin"
      badgeLabel="Platform Billing"
      headline="Platform HitPay Gateway"
      description="Configure the platform-owned HitPay account for organizer subscription plans and any future platform-billed transactions. This stays isolated from organizer-owned event revenue."
      ownerLabel="Admin / Platform Account"
      usagePoints={[
        'Organizer subscription plans such as Basic, Pro, and Premium.',
        'Platform-owned billing flows that should settle into the admin HitPay account.',
        'Shared platform reconciliation and audit visibility for subscription payments.',
        'A clean separation between platform billing and organizer event collections.',
      ]}
    />
  );
};
