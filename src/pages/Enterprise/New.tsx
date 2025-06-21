import React from 'react';

const BlankPage: React.FC = () => {
    console.log("BlankPage component rendered");
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Blank Page</h1>
      <p className="text-gray-600">This is a regular blank page. You can start building your UI here.</p>
    </div>
  );
};

export default BlankPage;