import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookTable from './pages/bookTable.js';
import Dashboard from './pages/Dashboard.js';
import AddBookPage from './pages/AddBookPage.js';
import CurrentlyReadingBooks from './pages/currentlyReading.js';
import BookDetailsPage from './pages/bookDetails.js'; // ✅ korrekt import

import Layout from './components/Layout.js';
import { ThemeProvider } from './components/Theme/ThemeContext.js';
import { UserProvider } from './components/common/Login/UserContext';
import PrivateRoute from './components/common/Login/PrivateRoute';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>

            {/* Login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Root redirect to login */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* Public route – everyone can see books */}
            <Route path="/books" element={<BookTable />} />

            {/* Private routes – require login */}
            <Route
              path="/add-book"
              element={
                <PrivateRoute>
                  <AddBookPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/currently-reading"
              element={
                <PrivateRoute>
                  <CurrentlyReadingBooks />
                </PrivateRoute>
              }
            />

            {/* ✅ New route for book details */}
            <Route
              path="/books/:id"
              element={
                <PrivateRoute>
                  <BookDetailsPage />
                </PrivateRoute>
              }
            />

          </Route>

          {/* Fallback if route not found */}
          <Route path="*" element={<Navigate to="/login" replace />} />
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
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
