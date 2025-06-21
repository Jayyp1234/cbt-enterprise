import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentsList from './PaymentsList';
import PaymentLinkDetail from './PaymentLinkDetail';
import PaymentLinkEdit from './PaymentLinkEdit';
import PaymentTransactions from './PaymentTransactions';
import PaymentAnalytics from './PaymentAnalytics';
import PaymentReminders from './PaymentReminders';
import PaymentSettings from './PaymentSettings';

const Payments: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PaymentsList />} />
      <Route path="/link/:id" element={<PaymentLinkDetail />} />
      <Route path="/link/:id/edit" element={<PaymentLinkEdit />} />
      <Route path="/transactions" element={<PaymentTransactions />} />
      <Route path="/analytics" element={<PaymentAnalytics />} />
      <Route path="/reminders" element={<PaymentReminders />} />
      <Route path="/settings" element={<PaymentSettings />} />
    </Routes>
  );
};

export default Payments;