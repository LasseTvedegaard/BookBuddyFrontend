import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './pages/bookTable';
import Dashboard from './pages/Dashboard';
import AddBookPage from './pages/BooksAdd';
import Layout from './components/Layout';
import { ThemeProvider } from './components/Theme/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<BookTable />} />
          <Route path="add-book" element={<AddBookPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
