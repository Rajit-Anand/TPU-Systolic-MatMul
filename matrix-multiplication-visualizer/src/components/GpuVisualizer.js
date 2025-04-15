import React, { useState, useEffect, useRef } from 'react';
import '../styles/Visualizer.css';
import MatrixEditor from './MatrixEditor';

const GpuVisualizer = () => {
  const [matrixA, setMatrixA] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [matrixB, setMatrixB] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [matrixC, setMatrixC] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [partialProducts, setPartialProducts] = useState(
    Array(8).fill().map(() => 
      Array(8).fill().map(() => 
        Array(8).fill(0)
      )
    )
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const [activeK, setActiveK] = useState(-1);
  
  // Track all simulation steps
  const simulationRef = useRef([]);
  const timerRef = useRef(null);

  // Initialize the simulation steps (partial products and reduction)
  useEffect(() => {
    // Reset state when matrices change
    setIsRunning(false);
    setCurrentStep(-1);
    setMatrixC(Array(8).fill().map(() => Array(8).fill(0)));
    setCycleCount(0);
    setActiveK(-1);

    // First, compute all partial products P[i,j,k] = A[i,k] * B[k,j]
    const products = Array(8).fill().map(() => 
      Array(8).fill().map(() => 
        Array(8).fill(0)
      )
    );
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {
          products[i][j][k] = matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    
    // Then, simulate the parallel reduction steps
    const steps = [];
    let resultMatrix = Array(8).fill().map(() => Array(8).fill(0));
    
    // Step 0: Initial state
    steps.push({
      matrix: resultMatrix.map(row => [...row]),
      activeK: -1,
      operation: "Initial state (all zeros)",
      cycleCount: 0
    });
    
    // Steps 1-8: In GPU, all cells accumulate in parallel for each k
    for (let k = 0; k < 8; k++) {
      // Deep copy the current result matrix
      const matrixBefore = resultMatrix.map(row => [...row]);
      
      // Update all cells in parallel (in real GPU)
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          resultMatrix[i][j] += products[i][j][k];
        }
      }
      
      // Store this step
      steps.push({
        matrixBefore: matrixBefore,
        matrix: resultMatrix.map(row => [...row]),
        products: products,
        activeK: k,
        operation: `All elements accumulate A[i,${k}] * B[${k},j] in parallel`,
        cycleCount: k + 1
      });
    }
    
    setPartialProducts(products);
    simulationRef.current = steps;
  }, [matrixA, matrixB]);

  // Control the animation
  useEffect(() => {
    if (isRunning && currentStep < simulationRef.current.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / speed);
    } else if (currentStep >= simulationRef.current.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentStep, speed]);

  // Update matrix C and activeK when step changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationRef.current.length) {
      const step = simulationRef.current[currentStep];
      setMatrixC(step.matrix);
      setActiveK(step.activeK);
      setCycleCount(step.cycleCount);
    }
  }, [currentStep]);

  const handleStart = () => {
    if (currentStep === simulationRef.current.length - 1) {
      // Restart if we're at the end
      setCurrentStep(-1);
      setMatrixC(Array(8).fill().map(() => Array(8).fill(0)));
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setMatrixC(Array(8).fill().map(() => Array(8).fill(0)));
    setCycleCount(0);
    setActiveK(-1);
  };

  const handleStepForward = () => {
    if (currentStep < simulationRef.current.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const getCellClass = (matrix, i, j) => {
    if (activeK === -1) return 'matrix-cell';
    
    if (matrix === 'A' && j === activeK) {
      return 'matrix-cell active';
    } else if (matrix === 'B' && i === activeK) {
      return 'matrix-cell active';
    } else if (matrix === 'C') {
      return 'matrix-cell active-all'; // In GPU all cells update simultaneously
    }
    return 'matrix-cell';
  };

  const handleMatrixAChange = (newMatrix) => {
    setMatrixA(newMatrix);
  };

  const handleMatrixBChange = (newMatrix) => {
    setMatrixB(newMatrix);
  };

  return (
    <div className="visualizer-container fade-in">
      <div className="visualizer-header">
        <h1>GPU Matrix Multiplication</h1>
        <p>Massively parallel implementation - all elements update simultaneously</p>
      </div>

      <div className="control-panel">
        <div className="control-buttons">
          <button className="control-btn" onClick={handleStepBackward} disabled={currentStep <= 0}>
            <i className="fas fa-step-backward"></i>
          </button>
          {isRunning ? (
            <button className="control-btn" onClick={handlePause}>
              <i className="fas fa-pause"></i>
            </button>
          ) : (
            <button className="control-btn" onClick={handleStart}>
              <i className="fas fa-play"></i>
            </button>
          )}
          <button className="control-btn" onClick={handleReset}>
            <i className="fas fa-undo"></i>
          </button>
          <button className="control-btn" onClick={handleStepForward} disabled={currentStep >= simulationRef.current.length - 1}>
            <i className="fas fa-step-forward"></i>
          </button>
        </div>
        <div className="speed-control">
          <label>Speed: </label>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed}x</span>
        </div>
        <div className="cycle-counter">
          <span>Cycle: {cycleCount} / {simulationRef.current.length - 1}</span>
        </div>
      </div>

      <div className="operation-display">
        {currentStep >= 0 && simulationRef.current.length > 0 && (
          <div className="operation-text">
            <p>{simulationRef.current[currentStep].operation}</p>
          </div>
        )}
      </div>

      <div className="matrix-editors-container">
        <MatrixEditor matrix={matrixA} onMatrixChange={handleMatrixAChange} matrixName="A" />
        <MatrixEditor matrix={matrixB} onMatrixChange={handleMatrixBChange} matrixName="B" />
      </div>

      <div className="matrices-container">
        <div className="matrix-display">
          <h3>Matrix A</h3>
          <div className="matrix-grid">
            {matrixA.map((row, i) => (
              row.map((cell, j) => (
                <div 
                  key={`A-${i}-${j}`} 
                  className={getCellClass('A', i, j)}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="operation-symbol">×</div>

        <div className="matrix-display">
          <h3>Matrix B</h3>
          <div className="matrix-grid">
            {matrixB.map((row, i) => (
              row.map((cell, j) => (
                <div 
                  key={`B-${i}-${j}`} 
                  className={getCellClass('B', i, j)}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="operation-symbol">=</div>

        <div className="matrix-display">
          <h3>Matrix C (Result)</h3>
          <div className="matrix-grid">
            {matrixC.map((row, i) => (
              row.map((cell, j) => (
                <div 
                  key={`C-${i}-${j}`} 
                  className={getCellClass('C', i, j)}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      {currentStep > 0 && (
        <div className="partial-products-section">
          <h3>Partial Products for Current Step</h3>
          <p>Showing partial products for k = {activeK}</p>
          <div className="partial-grid-container">
            {matrixA.map((_, i) => (
              <div key={`partial-row-${i}`} className="partial-row">
                {matrixB[0].map((_, j) => (
                  <div key={`partial-${i}-${j}`} className="partial-cell">
                    {simulationRef.current[currentStep].products[i][j][activeK]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="explanation-section">
        <div className="card">
          <h3>How GPU Matrix Multiplication Works</h3>
          <p>
            GPUs excel at matrix multiplication due to their massively parallel architecture. 
            Unlike CPUs, GPUs can compute thousands of operations simultaneously:
          </p>
          <ol>
            <li>
              <strong>Parallel Computing:</strong> In the GPU approach, all output elements C[i,j] are 
              computed concurrently, with each element assigned to a separate processing unit.
            </li>
            <li>
              <strong>Two-Phase Process:</strong> 
              <ul>
                <li>First, all partial products P[i,j,k] = A[i,k] * B[k,j] are computed in parallel</li>
                <li>Then, for each output element, the 8 partial products are accumulated (reduced)</li>
              </ul>
            </li>
            <li>
              <strong>Execution Time:</strong> For our 8×8 matrices, the GPU completes the 
              computation in just 8 cycles (compared to 512 cycles for the CPU approach).
            </li>
          </ol>
          <p>
            This massive parallelization makes GPUs ideal for deep learning, computer graphics, 
            and scientific computing applications that involve large matrix operations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GpuVisualizer; 