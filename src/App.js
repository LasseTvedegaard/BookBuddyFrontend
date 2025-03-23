import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookTable from './pages/bookTable.js';
import Dashboard from './pages/Dashboard.js';
import AddBookPage from './pages/AddBookPage.js';
import Layout from './components/Layout.js';
import { ThemeProvider } from './components/Theme/ThemeContext.js';
import { UserProvider } from './components/common/Login/UserContext';
import PrivateRoute from './components/common/Login/PrivateRoute';
import UserAuthForm from './components/common/Login/UserAuthForm';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Login-side */}
            <Route path="/login" element={<UserAuthForm />} />

            {/* Root redirect til login */}
            <Route index element={<Navigate to="/login" replace />} />

            {/* Offentlig rute – alle må se bøger */}
            <Route path="/books" element={<BookTable />} />

            {/* Private routes – kræver login */}
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
          </Route>

          {/* Fallback hvis route ikke findes */}
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
