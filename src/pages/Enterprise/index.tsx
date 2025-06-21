import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Students from './Students';
import Staff from './Staff';
import Payments from './Payment';
import Analytics from './Analytics';
import Settings from './Settings';
import FeatureManagement from './FeatureManagement';
import Content from './Content';
import Communication from './Communication';
import UserManagement from './UserManagement';
import Billing from './Billing';
import Auth from './Auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Unauthorized from './Auth/Unauthorized';

const Enterprise: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/students/*" element={
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/staff/*" element={
        <ProtectedRoute>
          <Staff />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute requiredRole={['Principal', 'Vice Principal']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/payments/*" element={
        <ProtectedRoute>
          <Payments />
        </ProtectedRoute>
      } />
      <Route path="/content" element={
        <ProtectedRoute>
          <Content />
        </ProtectedRoute>
      } />
      <Route path="/communication" element={
        <ProtectedRoute>
          <Communication />
        </ProtectedRoute>
      } />
      <Route path="/features" element={
        <ProtectedRoute requiredRole={['Principal', 'Vice Principal']}>
          <FeatureManagement />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute requiredRole={['Principal', 'Vice Principal']}>
          <Billing />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Enterprise;