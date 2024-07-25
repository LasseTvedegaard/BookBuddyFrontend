import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './pages/bookTable'; // Sørg for, at stien matcher nøjagtigt
import Dashboard from './pages/Dashboard'; // Opdater stien til Dashboard


function App() {

  
  return (
    <div className="App ff-container">
      <header className="App-header">
        <h1 className="text-4xl font-bold ff-text">BookBuddy</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} /> {/* Hjemmesiden er Dashboard */}
          <Route path="books" element={<BookTable />} /> {/* Books siden */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
