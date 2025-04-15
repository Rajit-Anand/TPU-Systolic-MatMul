import React, { useState } from 'react';
import '../styles/Comparison.css';

const Comparison = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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
        <h1>Architecture Comparison</h1>
        <p className="subtitle">Explore the differences between CPU, GPU, and TPU for matrix multiplication</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-table"></i> Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <i className="fas fa-chart-bar"></i> Performance
        </button>
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <i className="fas fa-microchip"></i> Architecture Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'usecases' ? 'active' : ''}`}
          onClick={() => setActiveTab('usecases')}
        >
          <i className="fas fa-tasks"></i> Use Cases
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          <div className="comparison-cards">
            <div className="comparison-card cpu-card">
              <div className="card-icon cpu-icon">
                <i className="fas fa-microchip"></i>
              </div>
              <h2>CPU</h2>
              <p className="card-subtitle">Central Processing Unit</p>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Performance:</span>
                  <span className="detail-value">512 cycles</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parallelism:</span>
                  <span className="detail-value">Sequential</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Energy Efficiency:</span>
                  <span className="detail-value">Low</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Programming:</span>
                  <span className="detail-value">Simple</span>
                </div>
              </div>
              <div className="card-strengths">
                <h3>Strengths</h3>
                <ul>
                  <li>Easy to program</li>
                  <li>Versatile</li>
                  <li>Low cost</li>
                </ul>
              </div>
            </div>

            <div className="comparison-card gpu-card">
              <div className="card-icon gpu-icon">
                <i className="fas fa-desktop"></i>
              </div>
              <h2>GPU</h2>
              <p className="card-subtitle">Graphics Processing Unit</p>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Performance:</span>
                  <span className="detail-value winning-value">8 cycles</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parallelism:</span>
                  <span className="detail-value winning-value">Massively Parallel</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Energy Efficiency:</span>
                  <span className="detail-value">Medium</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Programming:</span>
                  <span className="detail-value">Moderate</span>
                </div>
              </div>
              <div className="card-strengths">
                <h3>Strengths</h3>
                <ul>
                  <li>Excellent speed</li>
                  <li>Great for large matrices</li>
                  <li>Flexible for many tasks</li>
                </ul>
              </div>
            </div>

            <div className="comparison-card tpu-card">
              <div className="card-icon tpu-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h2>TPU</h2>
              <p className="card-subtitle">Tensor Processing Unit</p>
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Performance:</span>
                  <span className="detail-value">22 cycles</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Parallelism:</span>
                  <span className="detail-value">Systolic Array</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Energy Efficiency:</span>
                  <span className="detail-value winning-value">High</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Programming:</span>
                  <span className="detail-value">Complex</span>
                </div>
              </div>
              <div className="card-strengths">
                <h3>Strengths</h3>
                <ul>
                  <li>Energy efficient</li>
                  <li>ML optimized</li>
                  <li>Consistent performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="comparison-table">
            <h2>Detailed Comparison</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th className="metric-column">Metric</th>
                    <th className="cpu-column">CPU</th>
                    <th className="gpu-column">GPU</th>
                    <th className="tpu-column">TPU</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index}>
                      <td className="metric-column">{row.metric}</td>
                      <td className={`cpu-column ${row.winner === 'cpu' ? 'winner-cell' : ''}`}>
                        {row.cpu}
                      </td>
                      <td className={`gpu-column ${row.winner === 'gpu' ? 'winner-cell' : ''}`}>
                        {row.gpu}
                      </td>
                      <td className={`tpu-column ${row.winner === 'tpu' ? 'winner-cell' : ''}`}>
                        {row.tpu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="tab-content">
          <div className="performance-section">
            <h2>Performance Comparison</h2>
            <p className="performance-description">
              This visualization compares the number of cycles required to compute an 8×8 matrix multiplication.
              Each architecture has significant differences in performance due to its parallel processing capabilities.
            </p>
            
            <div className="visual-comparison">
              <div className="performance-metrics">
                <div className="metric-card">
                  <div className="metric-value">512</div>
                  <div className="metric-label">CPU Cycles</div>
                  <div className="metric-info">Sequential, one operation at a time</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value highlight">8</div>
                  <div className="metric-label">GPU Cycles</div>
                  <div className="metric-info">Parallel, all elements computed at once</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">22</div>
                  <div className="metric-label">TPU Cycles</div>
                  <div className="metric-info">Systolic array, wave-like computation</div>
                </div>
              </div>

              <div className="bar-chart-container">
                <h3>Cycles Required (lower is better)</h3>
                <div className="bar-chart">
                  <div className="bar-wrapper">
                    <div className="bar-label">CPU</div>
                    <div className="bar cpu-bar" style={{ width: '100%' }}>
                      <span className="bar-value">512</span>
                    </div>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar-label">GPU</div>
                    <div className="bar gpu-bar" style={{ width: `${(8/512)*100}%` }}>
                      <span className="bar-value">8</span>
                    </div>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar-label">TPU</div>
                    <div className="bar tpu-bar" style={{ width: `${(22/512)*100}%` }}>
                      <span className="bar-value">22</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="speedup-chart">
                <h3>Speedup vs CPU (higher is better)</h3>
                <div className="donut-charts">
                  <div className="donut-chart">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#3d5af1" strokeWidth="10"
                        strokeDasharray="314" strokeDashoffset="0" />
                      <text x="60" y="65" textAnchor="middle" fill="#f8fafc" fontSize="24">1×</text>
                    </svg>
                    <div className="donut-label">CPU</div>
                  </div>
                  <div className="donut-chart">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#3d5af1" strokeWidth="10"
                        strokeDasharray="314" strokeDashoffset="0" 
                        transform="rotate(-90 60 60)" />
                      <text x="60" y="65" textAnchor="middle" fill="#f8fafc" fontSize="24">64×</text>
                    </svg>
                    <div className="donut-label">GPU</div>
                  </div>
                  <div className="donut-chart">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#3d5af1" strokeWidth="10"
                        strokeDasharray="314" strokeDashoffset="185"
                        transform="rotate(-90 60 60)" />
                      <text x="60" y="65" textAnchor="middle" fill="#f8fafc" fontSize="24">23×</text>
                    </svg>
                    <div className="donut-label">TPU</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Architecture Details Tab */}
      {activeTab === 'details' && (
        <div className="tab-content">
          <div className="architecture-details">
            <div className="architecture-card">
              <div className="arch-header cpu-header">
                <div className="arch-icon-lg">
                  <i className="fas fa-microchip"></i>
                </div>
                <h2>CPU Architecture</h2>
              </div>
              <div className="arch-content">
                <div className="arch-description">
                  <p>
                    CPUs (Central Processing Units) are general-purpose processors designed for sequential processing. 
                    For matrix multiplication, they use a triple-nested loop approach, performing one operation at a time.
                  </p>
                  <div className="arch-code">
                    <pre>
{`for i from 0 to n-1:
  for j from 0 to n-1:
    for k from 0 to n-1:
      C[i,j] += A[i,k] * B[k,j]`}
                    </pre>
                  </div>
                  <div className="arch-diagram cpu-diagram">
                    <div className="diagram-element computation-unit">
                      <div className="element-label">Single Compute Unit</div>
                    </div>
                    <div className="diagram-element memory-unit">
                      <div className="element-label">Cache/Memory</div>
                    </div>
                    <div className="diagram-arrows">
                      <div className="arrow arrow1"></div>
                      <div className="arrow arrow2"></div>
                    </div>
                  </div>
                </div>
                <div className="pros-cons">
                  <div className="pros">
                    <h3>Advantages</h3>
                    <ul>
                      <li>Simple to program and debug</li>
                      <li>Versatile for general computing</li>
                      <li>Low hardware cost</li>
                      <li>High clock speeds</li>
                    </ul>
                  </div>
                  <div className="cons">
                    <h3>Limitations</h3>
                    <ul>
                      <li>Sequential processing is slow for large matrices</li>
                      <li>Limited parallelism</li>
                      <li>Poor energy efficiency for math operations</li>
                      <li>Performance doesn't scale well</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="architecture-card">
              <div className="arch-header gpu-header">
                <div className="arch-icon-lg">
                  <i className="fas fa-desktop"></i>
                </div>
                <h2>GPU Architecture</h2>
              </div>
              <div className="arch-content">
                <div className="arch-description">
                  <p>
                    GPUs (Graphics Processing Units) are designed for parallel processing with thousands of cores.
                    For matrix multiplication, each output element is computed by a separate thread, with all elements
                    calculated simultaneously.
                  </p>
                  <div className="arch-code">
                    <pre>
{`// Each thread computes one output element
function compute_element(i, j):
  sum = 0
  for k from 0 to n-1:
    sum += A[i,k] * B[k,j]
  C[i,j] = sum

// All threads execute in parallel`}
                    </pre>
                  </div>
                  <div className="arch-diagram gpu-diagram">
                    <div className="gpu-grid">
                      {Array(16).fill().map((_, i) => (
                        <div key={i} className="gpu-core"></div>
                      ))}
                    </div>
                    <div className="element-label">Massive Parallel Cores</div>
                  </div>
                </div>
                <div className="pros-cons">
                  <div className="pros">
                    <h3>Advantages</h3>
                    <ul>
                      <li>Massive parallelism (thousands of cores)</li>
                      <li>Excellent for large matrices</li>
                      <li>Great performance for graphics and math</li>
                      <li>Flexible programming models (CUDA, OpenCL)</li>
                    </ul>
                  </div>
                  <div className="cons">
                    <h3>Limitations</h3>
                    <ul>
                      <li>High power consumption</li>
                      <li>Complex programming model</li>
                      <li>Expensive hardware</li>
                      <li>Memory transfer overheads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="architecture-card">
              <div className="arch-header tpu-header">
                <div className="arch-icon-lg">
                  <i className="fas fa-brain"></i>
                </div>
                <h2>TPU Architecture</h2>
              </div>
              <div className="arch-content">
                <div className="arch-description">
                  <p>
                    TPUs (Tensor Processing Units) use a systolic array architecture where data flows through a grid
                    of processing elements. Each element multiplies inputs and accumulates results, passing data to neighbors.
                  </p>
                  <div className="arch-diagram tpu-diagram">
                    <div className="systolic-mini-grid">
                      {Array(16).fill().map((_, i) => (
                        <div key={i} className="pe-mini-cell">
                          <div className="pe-mini-dot"></div>
                        </div>
                      ))}
                    </div>
                    <div className="diagram-arrows tpu-arrows">
                      <div className="tpu-arrow horizontal"></div>
                      <div className="tpu-arrow vertical"></div>
                    </div>
                    <div className="element-label">Systolic Array of PEs</div>
                  </div>
                  <p className="tpu-flow-desc">
                    Matrix A elements flow horizontally, Matrix B elements flow vertically.
                    Each PE performs multiply-accumulate operations as data passes through.
                  </p>
                </div>
                <div className="pros-cons">
                  <div className="pros">
                    <h3>Advantages</h3>
                    <ul>
                      <li>Exceptional energy efficiency</li>
                      <li>Optimal for matrix/tensor operations</li>
                      <li>Ideal for ML inferencing</li>
                      <li>Minimal data movement</li>
                    </ul>
                  </div>
                  <div className="cons">
                    <h3>Limitations</h3>
                    <ul>
                      <li>Less flexible than CPUs/GPUs</li>
                      <li>Specialized hardware and programming</li>
                      <li>Only efficient for specific operations</li>
                      <li>Complex data flow management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use Cases Tab */}
      {activeTab === 'usecases' && (
        <div className="tab-content">
          <div className="use-cases-section">
            <h2>Choosing the Right Architecture</h2>
            <p className="section-description">
              Each architecture excels in different scenarios. Understanding their strengths helps select
              the most appropriate one for your specific needs.
            </p>

            <div className="use-case-grid">
              <div className="use-case-card cpu-use">
                <div className="use-case-header">
                  <div className="use-case-icon">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <h3>When to Use CPU</h3>
                </div>
                <div className="use-case-content">
                  <ul className="use-case-list">
                    <li>
                      <span className="use-case-title">Small matrices</span>
                      <p>For small matrix operations, CPU overhead may be less than GPU/TPU initialization time</p>
                    </li>
                    <li>
                      <span className="use-case-title">Development & debugging</span>
                      <p>Easier to develop, test, and debug algorithms on standard CPU architecture</p>
                    </li>
                    <li>
                      <span className="use-case-title">General-purpose applications</span>
                      <p>When matrix multiplication is just one of many operations in a varied workload</p>
                    </li>
                    <li>
                      <span className="use-case-title">Low hardware costs</span>
                      <p>When working with limited resources or budget constraints</p>
                    </li>
                  </ul>
                  <div className="use-case-example">
                    <h4>Example Workloads</h4>
                    <div className="example-tags">
                      <span className="example-tag">Scientific Computing</span>
                      <span className="example-tag">Small Datasets</span>
                      <span className="example-tag">Algorithm Development</span>
                      <span className="example-tag">Desktop Applications</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="use-case-card gpu-use">
                <div className="use-case-header">
                  <div className="use-case-icon">
                    <i className="fas fa-desktop"></i>
                  </div>
                  <h3>When to Use GPU</h3>
                </div>
                <div className="use-case-content">
                  <ul className="use-case-list">
                    <li>
                      <span className="use-case-title">Large matrices</span>
                      <p>When computing large matrix operations where parallelism provides significant speedup</p>
                    </li>
                    <li>
                      <span className="use-case-title">Training neural networks</span>
                      <p>For deep learning model training where gradient computations benefit from parallelism</p>
                    </li>
                    <li>
                      <span className="use-case-title">Graphics and rendering</span>
                      <p>For applications involving computer graphics, image processing, or rendering</p>
                    </li>
                    <li>
                      <span className="use-case-title">Batch processing</span>
                      <p>When processing multiple matrices simultaneously with high throughput requirements</p>
                    </li>
                  </ul>
                  <div className="use-case-example">
                    <h4>Example Workloads</h4>
                    <div className="example-tags">
                      <span className="example-tag">Deep Learning Training</span>
                      <span className="example-tag">Computer Graphics</span>
                      <span className="example-tag">High-Performance Computing</span>
                      <span className="example-tag">Data Science</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="use-case-card tpu-use">
                <div className="use-case-header">
                  <div className="use-case-icon">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3>When to Use TPU</h3>
                </div>
                <div className="use-case-content">
                  <ul className="use-case-list">
                    <li>
                      <span className="use-case-title">ML inference at scale</span>
                      <p>When deploying trained models for inference with high throughput and efficiency</p>
                    </li>
                    <li>
                      <span className="use-case-title">Power-constrained environments</span>
                      <p>When energy efficiency is critical, such as in data centers or edge devices</p>
                    </li>
                    <li>
                      <span className="use-case-title">Consistent performance</span>
                      <p>Applications requiring predictable latency and throughput for matrix operations</p>
                    </li>
                    <li>
                      <span className="use-case-title">Specialized ML workloads</span>
                      <p>For specialized deep learning operations like transformers or convolutional networks</p>
                    </li>
                  </ul>
                  <div className="use-case-example">
                    <h4>Example Workloads</h4>
                    <div className="example-tags">
                      <span className="example-tag">ML Model Serving</span>
                      <span className="example-tag">Large Language Models</span>
                      <span className="example-tag">Cloud AI Services</span>
                      <span className="example-tag">Edge Computing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="decision-guide">
              <h3>Decision Guide</h3>
              <div className="decision-flowchart">
                <div className="decision-node start-node">
                  <div className="node-content">
                    <span>Matrix Multiplication Task</span>
                  </div>
                  <div className="node-arrow down-arrow"></div>
                </div>
                <div className="decision-branch">
                  <div className="decision-node question-node">
                    <div className="node-content">
                      <span>Small matrix or prototype?</span>
                    </div>
                  </div>
                  <div className="branch-paths">
                    <div className="branch-path">
                      <div className="path-label">Yes</div>
                      <div className="node-arrow right-arrow"></div>
                      <div className="decision-node result-node cpu-result">
                        <div className="node-content">
                          <i className="fas fa-microchip"></i>
                          <span>Use CPU</span>
                        </div>
                      </div>
                    </div>
                    <div className="branch-path">
                      <div className="path-label">No</div>
                      <div className="node-arrow down-arrow"></div>
                      <div className="decision-node question-node">
                        <div className="node-content">
                          <span>Power efficiency critical?</span>
                        </div>
                      </div>
                      <div className="branch-paths">
                        <div className="branch-path">
                          <div className="path-label">Yes</div>
                          <div className="node-arrow right-arrow"></div>
                          <div className="decision-node result-node tpu-result">
                            <div className="node-content">
                              <i className="fas fa-brain"></i>
                              <span>Use TPU</span>
                            </div>
                          </div>
                        </div>
                        <div className="branch-path">
                          <div className="path-label">No</div>
                          <div className="node-arrow down-arrow"></div>
                          <div className="decision-node question-node">
                            <div className="node-content">
                              <span>Need maximum speed?</span>
                            </div>
                          </div>
                          <div className="branch-paths">
                            <div className="branch-path">
                              <div className="path-label">Yes</div>
                              <div className="node-arrow right-arrow"></div>
                              <div className="decision-node result-node gpu-result">
                                <div className="node-content">
                                  <i className="fas fa-desktop"></i>
                                  <span>Use GPU</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison; 