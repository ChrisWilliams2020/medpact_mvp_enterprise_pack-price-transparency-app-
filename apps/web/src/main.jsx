import React from 'react';
import { createRoot } from 'react-dom/client';
import Benchmarks from './pages/Benchmarks';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Benchmarks />
  </React.StrictMode>
);