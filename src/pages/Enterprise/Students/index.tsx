import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentList from './StudentList';
import StudentDetail from './StudentDetail';
import StudentEdit from './StudentEdit';
import StudentBulkActions from './StudentBulkActions';

const Students: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentList />} />
      <Route path="/:id" element={<StudentDetail />} />
      <Route path="/:id/edit" element={<StudentEdit />} />
      <Route path="/bulk-actions" element={<StudentBulkActions />} />
    </Routes>
  );
};

export default Students;