import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Comparison from './components/Comparison';
import CpuVisualizer from './components/CpuVisualizer';
import GpuVisualizer from './components/GpuVisualizer';
import TpuVisualizer from './components/TpuVisualizer';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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
    <div className="App">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
