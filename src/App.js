import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './components/bookTable'; // Sørg for, at stien matcher nøjagtigt

function App() {
  return (
    <div className="App ff-container">
      <header className="App-header">
        <h1 className="text-4xl font-bold ff-text">BookBuddy</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<BookTable />} /> {/* Definer ruten til BookTable */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
