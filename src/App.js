import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './pages/bookTable'; 
import Dashboard from './pages/Dashboard'; 

function App() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="books" element={<BookTable />} />
    </Routes>
  );
}

export default App;
