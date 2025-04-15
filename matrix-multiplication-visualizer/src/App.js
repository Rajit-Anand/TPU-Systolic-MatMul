import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Comparison from './components/Comparison';
import TpuVisualizer from './components/TpuVisualizer';
import GpuVisualizer from './components/GpuVisualizer';
import CpuVisualizer from './components/CpuVisualizer';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Set CSS variables for theming
  useEffect(() => {
    // Define theme colors
    document.documentElement.style.setProperty('--primary-color', '#1a1e2e');
    document.documentElement.style.setProperty('--secondary-color', '#3D5AF1');
    document.documentElement.style.setProperty('--accent-color', '#E83A82');
    document.documentElement.style.setProperty('--success-color', '#22C55E');
    document.documentElement.style.setProperty('--text-color', '#94a3b8');
    document.documentElement.style.setProperty('--light-text', '#e2e8f0');
    document.documentElement.style.setProperty('--dark-text', '#94a3b8');
    document.documentElement.style.setProperty('--card-bg', '#20263c');
    document.documentElement.style.setProperty('--background-color', '#131627');
    document.documentElement.style.setProperty('--border-color', '#2d3748');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'comparison':
        return <Comparison />;
      case 'cpu':
        return <CpuVisualizer />;
      case 'gpu':
        return <GpuVisualizer />;
      case 'tpu':
        return <TpuVisualizer />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={renderPage()} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/tpu" element={<TpuVisualizer />} />
            <Route path="/gpu" element={<GpuVisualizer />} />
            <Route path="/cpu" element={<CpuVisualizer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
