import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ setCurrentPage, currentPage }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Matrix Multiplication Visualizer</h1>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
            <a href="https://www.canva.com/design/DAGkuJqnd38/zMjuCiJnYgan7lQr__GS8g/edit?utm_content=DAGkuJqnd38&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" target="_blank" rel="noopener noreferrer">Slides</a>
        </li>
        <li className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}>
          <button onClick={() => setCurrentPage('home')}>Home</button>
        </li>
        <li className={`nav-item ${currentPage === 'comparison' ? 'active' : ''}`}>
          <button onClick={() => setCurrentPage('comparison')}>Comparison</button>
        </li>
        <li className={`nav-item ${currentPage === 'cpu' ? 'active' : ''}`}>
          <button onClick={() => setCurrentPage('cpu')}>CPU</button>
        </li>
        <li className={`nav-item ${currentPage === 'gpu' ? 'active' : ''}`}>
          <button onClick={() => setCurrentPage('gpu')}>GPU</button>
        </li>
        <li className={`nav-item ${currentPage === 'tpu' ? 'active' : ''}`}>
          <button onClick={() => setCurrentPage('tpu')}>TPU</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 