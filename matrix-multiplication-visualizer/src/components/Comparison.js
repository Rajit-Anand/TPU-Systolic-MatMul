import React from 'react';
import '../styles/Comparison.css';

const Comparison = () => {
  // Data for comparison chart
  const comparisonData = [
    { 
      metric: 'Performance (8×8 matrix)', 
      cpu: '512 cycles', 
      gpu: '8 cycles',
      tpu: '22 cycles',
      winner: 'gpu'
    },
    { 
      metric: 'Energy Efficiency', 
      cpu: 'Low', 
      gpu: 'Medium',
      tpu: 'High',
      winner: 'tpu'
    },
    { 
      metric: 'Parallelism', 
      cpu: 'Low - Sequential', 
      gpu: 'High - SIMD',
      tpu: 'Medium - Systolic',
      winner: 'gpu'
    },
    { 
      metric: 'Programming Complexity', 
      cpu: 'Low', 
      gpu: 'Medium',
      tpu: 'High',
      winner: 'cpu'
    },
    { 
      metric: 'Scalability for Large Matrices', 
      cpu: 'Poor', 
      gpu: 'Excellent',
      tpu: 'Very Good',
      winner: 'gpu'
    },
    { 
      metric: 'Hardware Cost', 
      cpu: 'Low', 
      gpu: 'High',
      tpu: 'Medium',
      winner: 'cpu'
    },
    { 
      metric: 'ML Workload Suitability', 
      cpu: 'Poor', 
      gpu: 'Good',
      tpu: 'Excellent',
      winner: 'tpu'
    }
  ];

  return (
    <div className="comparison-container fade-in">
      <div className="comparison-header">
        <h1>CPU vs GPU vs TPU</h1>
        <p>Comparing the three approaches to matrix multiplication</p>
      </div>

      <div className="comparison-chart">
        <div className="chart-row chart-header">
          <div className="chart-cell metric-header">Metric</div>
          <div className="chart-cell cpu-header">CPU</div>
          <div className="chart-cell gpu-header">GPU</div>
          <div className="chart-cell tpu-header">TPU</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <div key={index} className="chart-row">
            <div className="chart-cell metric-cell">{row.metric}</div>
            <div className={`chart-cell cpu-cell ${row.winner === 'cpu' ? 'winner' : ''}`}>
              {row.cpu}
            </div>
            <div className={`chart-cell gpu-cell ${row.winner === 'gpu' ? 'winner' : ''}`}>
              {row.gpu}
            </div>
            <div className={`chart-cell tpu-cell ${row.winner === 'tpu' ? 'winner' : ''}`}>
              {row.tpu}
            </div>
          </div>
        ))}
      </div>

      <div className="cycles-comparison">
        <h2>Performance Comparison</h2>
        <div className="bar-chart">
          <div className="bar-container">
            <div className="bar-label">CPU</div>
            <div className="bar cpu-bar" style={{ width: '100%' }}>
              <span className="bar-value">512 cycles</span>
            </div>
          </div>
          <div className="bar-container">
            <div className="bar-label">GPU</div>
            <div className="bar gpu-bar" style={{ width: `${(8/512)*100}%` }}>
              <span className="bar-value">8 cycles</span>
            </div>
          </div>
          <div className="bar-container">
            <div className="bar-label">TPU</div>
            <div className="bar tpu-bar" style={{ width: `${(22/512)*100}%` }}>
              <span className="bar-value">22 cycles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="architecture-comparisons">
        <div className="architecture-section card">
          <h2>CPU (Central Processing Unit)</h2>
          <div className="architecture-details">
            <div className="architecture-image cpu-image">
              <div className="arch-icon">CPU</div>
            </div>
            <div className="architecture-description">
              <h3>How It Works</h3>
              <p>
                CPUs execute matrix multiplication using a triple nested loop, computing one element at a time.
                Each element C[i,j] requires 8 multiplications and additions for an 8×8 matrix, executed sequentially.
              </p>
              <h3>Pros</h3>
              <ul>
                <li>Simple to program and debug</li>
                <li>Good for small matrices</li>
                <li>Versatile for general computing</li>
              </ul>
              <h3>Cons</h3>
              <ul>
                <li>Very slow for large matrices</li>
                <li>Poor energy efficiency</li>
                <li>Limited parallelism</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="architecture-section card">
          <h2>GPU (Graphics Processing Unit)</h2>
          <div className="architecture-details">
            <div className="architecture-image gpu-image">
              <div className="arch-icon">GPU</div>
            </div>
            <div className="architecture-description">
              <h3>How It Works</h3>
              <p>
                GPUs compute matrix multiplication by assigning one thread to each output element.
                Each thread computes all 8 multiplications for its element in parallel, then reduces (adds) them together.
              </p>
              <h3>Pros</h3>
              <ul>
                <li>Extremely fast with massive parallelism</li>
                <li>Excellent for large matrices</li>
                <li>Flexible for various compute tasks</li>
              </ul>
              <h3>Cons</h3>
              <ul>
                <li>High power consumption</li>
                <li>Complex programming model</li>
                <li>Expensive hardware</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="architecture-section card">
          <h2>TPU (Tensor Processing Unit)</h2>
          <div className="architecture-details">
            <div className="architecture-image tpu-image">
              <div className="arch-icon">TPU</div>
            </div>
            <div className="architecture-description">
              <h3>How It Works</h3>
              <p>
                TPUs use a systolic array architecture where data flows through a grid of processing elements.
                Each element multiplies inputs and accumulates results, then passes data to its neighbors.
              </p>
              <h3>Pros</h3>
              <ul>
                <li>Exceptional energy efficiency</li>
                <li>Optimized for matrix operations</li>
                <li>Ideal for deep learning workloads</li>
              </ul>
              <h3>Cons</h3>
              <ul>
                <li>Less flexible than CPUs/GPUs</li>
                <li>Specialized hardware and programming</li>
                <li>Only efficient for specific tensor operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="use-cases-section card">
        <h2>When to Use Each Architecture</h2>
        <div className="use-cases">
          <div className="use-case-col">
            <h3>Use CPU When:</h3>
            <ul>
              <li>Working with small matrices</li>
              <li>Developing/debugging algorithms</li>
              <li>Running general-purpose code</li>
              <li>Hardware cost is a primary concern</li>
            </ul>
          </div>
          <div className="use-case-col">
            <h3>Use GPU When:</h3>
            <ul>
              <li>Processing large matrices</li>
              <li>Need maximum computation speed</li>
              <li>Working with graphics processing</li>
              <li>Training deep learning models</li>
            </ul>
          </div>
          <div className="use-case-col">
            <h3>Use TPU When:</h3>
            <ul>
              <li>Energy efficiency is critical</li>
              <li>Running inference at scale</li>
              <li>Working with deep learning in production</li>
              <li>Need consistent matrix computation performance</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Comparison; 