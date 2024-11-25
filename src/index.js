import React from 'react';
import ReactDOM from 'react-dom/client';

import { AuthContextProvider } from './contexts';
import { App, AppNavbar } from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
  <AppNavbar />
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </>
);