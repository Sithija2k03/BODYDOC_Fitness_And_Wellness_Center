import React from 'react';
import ReactDOM from 'react-dom/client';  
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { BrowserRouter } from "react-router-dom";  
import { GlobalProvider } from "./context/globalContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalProvider>
  <BrowserRouter>
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
  </BrowserRouter>
  </GlobalProvider>
);

