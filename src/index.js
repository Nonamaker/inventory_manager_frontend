import React from 'react';
import ReactDOM from 'react-dom/client';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { AuthContextProvider } from './contexts';
import { App } from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

/* npm run build && npx serve -s build */


/* 
Plan:

Phase 1:
  - Set up a network-then-cache system for offline data access.
  - Dynamic actions are disabled in offline mode.

Phase 2:
  - Enamble dynamic data actions in offline mode.
  - Cache offline requests to then sync in the background?

*/

root.render(
  <>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();