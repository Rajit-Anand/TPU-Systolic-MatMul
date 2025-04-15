import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Matrix Multiplication Visualizer</h3>
          <p>An interactive learning tool to understand different approaches to matrix multiplication in CPU, GPU, and TPU architectures.</p>
        </div>
        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><a href="https://en.wikipedia.org/wiki/Matrix_multiplication" target="_blank" rel="noopener noreferrer">Matrix Multiplication</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Systolic_array" target="_blank" rel="noopener noreferrer">Systolic Arrays</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Graphics_processing_unit" target="_blank" rel="noopener noreferrer">GPU Architecture</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Tensor_Processing_Unit" target="_blank" rel="noopener noreferrer">TPU Architecture</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Matrix Multiplication Visualizer | Created with React</p>
      </div>
    </footer>
  );
};

export default Footer; 