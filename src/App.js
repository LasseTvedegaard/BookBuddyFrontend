import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
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
          backgroundColor: '#ffc107', // Change to your desired color
          color: '#000', // Text color for better readability
          fontSize: '16px', // Adjust font size
          padding: '10px', // Adjust padding
          maxWidth: '300px', // Max width for the toast box
        }}
      /> {/* Add ToastContainer here */}
    </ThemeProvider>
  );
}

export default App;
