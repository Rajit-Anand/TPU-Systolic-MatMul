import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ setCurrentPage, currentPage }) => {
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
  };

  // Check for user's preference on component mount
  React.useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

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
        <li className="nav-item theme-toggle">
          <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 