import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './pages/bookTable'; // Sørg for, at stien matcher nøjagtigt
import Dashboard from './pages/Dashboard'; // Opdater stien til Dashboard
import Topbar from './pages/global/Topbar';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <>
      <ToastContainer theme={theme} position="bottom-right" newestOnTop />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="books" element={<BookTable />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
    </>
  );
}

export default App;
