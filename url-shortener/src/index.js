import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Logger from './utils/logger';

// Handle uncaught errors with the logger
window.addEventListener('error', (event) => {
  Logger.error(`Uncaught error: ${event.error?.message || 'Unknown error'}`);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  Logger.error(`Unhandled promise rejection: ${event.reason}`);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);