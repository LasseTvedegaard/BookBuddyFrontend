import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom'; // Importer BrowserRouter
import "./index.css";
import "./App.css";
import App from "./App";
import { ThemeProvider } from "./components/Theme/ThemeContext";
import Background from "./components/Background";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <Background>
          <App />
        </Background>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
