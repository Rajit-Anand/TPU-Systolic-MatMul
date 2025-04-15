import React from 'react';
import '../styles/Home.css';

const Home = ({ setCurrentPage }) => {
  return (
    <div className="home-container fade-in">
      <div className="hero-section">
        <h1>Matrix Multiplication Architectures</h1>
        <p className="subtitle">Explore and compare CPU, GPU, and TPU approaches to matrix multiplication</p>
        <div className="cta-buttons">
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentPage('comparison')}
          >
            View Comparison
          </button>
        </div>
      </div>

      <div className="architecture-cards">
        <div className="card architecture-card" onClick={() => setCurrentPage('cpu')}>
          <div className="architecture-icon cpu-icon">
            <i className="fas fa-microchip"></i>
          </div>
          <h2>CPU</h2>
          <p>Traditional approach using sequential processing with nested loops</p>
          <ul>
            <li>Triple nested loop implementation</li>
            <li>Each operation processed sequentially</li>
            <li>~512 cycles for 8×8 matrix multiplication</li>
          </ul>
          <button className="btn btn-outline">Explore CPU</button>
        </div>

        <div className="card architecture-card" onClick={() => setCurrentPage('gpu')}>
          <div className="architecture-icon gpu-icon">
            <i className="fas fa-tv"></i>
          </div>
          <h2>GPU</h2>
          <p>Parallel processing approach with massively parallel computations</p>
          <ul>
            <li>Parallel computation of output elements</li>
            <li>Efficient for large matrices</li>
            <li>Just 8 cycles for 8×8 matrix multiplication</li>
          </ul>
          <button className="btn btn-outline">Explore GPU</button>
        </div>

        <div className="card architecture-card" onClick={() => setCurrentPage('tpu')}>
          <div className="architecture-icon tpu-icon">
            <i className="fas fa-network-wired"></i>
          </div>
          <h2>TPU (Systolic Array)</h2>
          <p>Specialized hardware for matrix operations using systolic processing</p>
          <ul>
            <li>Data flows through processing elements</li>
            <li>Energy-efficient design</li>
            <li>~22 cycles for 8×8 matrix multiplication</li>
          </ul>
          <button className="btn btn-outline">Explore TPU</button>
        </div>
      </div>

      <div className="overview-section">
        <h2>What is Matrix Multiplication?</h2>
        <p>
          Matrix multiplication is a fundamental operation in many computational tasks, including deep learning, computer graphics, and scientific computing. The operation combines two matrices to produce a single result matrix.
        </p>
        <div className="formula-container">
          <div className="matrix-formula">
            <div className="matrix">
              <div>1 2</div>
              <div>3 4</div>
            </div>
            <div className="operator">×</div>
            <div className="matrix">
              <div>5 6</div>
              <div>7 8</div>
            </div>
            <div className="operator">=</div>
            <div className="matrix">
              <div>19 22</div>
              <div>43 50</div>
            </div>
          </div>
        </div>
        <p>
          Different hardware architectures implement this operation in various ways, each with advantages and trade-offs in terms of speed, power efficiency, and scalability.
        </p>
      </div>
    </div>
  );
};

export default Home; 