import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BookTable from './pages/bookTable'; // Sørg for, at stien matcher nøjagtigt
import Dashboard from './pages/Dashboard'; // Opdater stien til Dashboard
import Topbar from './pages/global/Topbar';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className='content'>
            <Topbar />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
