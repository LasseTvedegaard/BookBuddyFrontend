import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer 
        position="bottom-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        toastStyle={{
          backgroundColor: '#ffc107',
          color: '#000',
          fontSize: '16px',
          padding: '10px',
          maxWidth: '300px',
        }}
      />
    </ThemeProvider>
  );
}

export default App;
