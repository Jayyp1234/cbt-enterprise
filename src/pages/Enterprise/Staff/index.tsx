import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffList from './StaffList';
import StaffDetail from './StaffDetail';
import StaffEdit from './StaffEdit';
import StaffBulkActions from './StaffBulkActions';
import StaffPermissions from './StaffPermissions';

const Staff: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StaffList />} />
      <Route path="/:id" element={<StaffDetail />} />
      <Route path="/:id/edit" element={<StaffEdit />} />
      <Route path="/:id/permissions" element={<StaffPermissions />} />
      <Route path="/bulk-actions" element={<StaffBulkActions />} />
    </Routes>
  );
};

export default Staff;