import React, { useState, useEffect, useRef } from 'react';
import '../styles/Visualizer.css';
import MatrixEditor from './MatrixEditor';

const CpuVisualizer = () => {
  const [matrixA, setMatrixA] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [matrixB, setMatrixB] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [matrixC, setMatrixC] = useState(Array(8).fill().map(() => Array(8).fill(0)));
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const [activeCell, setActiveCell] = useState({ i: -1, j: -1, k: -1 });
  
  // Track all simulation steps
  const simulationRef = useRef([]);
  const timerRef = useRef(null);

  // Initialize the simulation steps
  useEffect(() => {
    // Reset state when matrices change
    setIsRunning(false);
    setCurrentStep(-1);
    setMatrixC(Array(8).fill().map(() => Array(8).fill(0)));
    setCycleCount(0);
    setActiveCell({ i: -1, j: -1, k: -1 });

    const steps = [];
    let resultMatrix = Array(8).fill().map(() => Array(8).fill(0));
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        for (let k = 0; k < 8; k++) {
          // Deep copy of current matrix state before this operation
          const matrixCopy = resultMatrix.map(row => [...row]);
          
          // Perform the multiplication and addition
          resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
          
          // Store the step information
          steps.push({
            beforeMatrix: matrixCopy,
            afterMatrix: resultMatrix.map(row => [...row]),
            i, j, k,
            operation: `C[${i},${j}] += A[${i},${k}] * B[${k},${j}]`,
            value: matrixA[i][k] * matrixB[k][j],
            cycleCount: steps.length + 1
          });
        }
      }
    }
    
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

  // Update matrix C and active cell when step changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationRef.current.length) {
      const step = simulationRef.current[currentStep];
      setMatrixC(step.afterMatrix);
      setActiveCell({ i: step.i, j: step.j, k: step.k });
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
    setActiveCell({ i: -1, j: -1, k: -1 });
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
  
  const getCellClass = (matrix, i, j, k = -1) => {
    if (matrix === 'A' && i === activeCell.i && j === activeCell.k) {
      return 'matrix-cell active';
    } else if (matrix === 'B' && i === activeCell.k && j === activeCell.j) {
      return 'matrix-cell active';
    } else if (matrix === 'C' && i === activeCell.i && j === activeCell.j) {
      return 'matrix-cell active';
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
        <h1>CPU Matrix Multiplication</h1>
        <p>Triple nested loop implementation - one operation per cycle</p>
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
          <span>Cycle: {cycleCount} / {simulationRef.current.length}</span>
        </div>
      </div>

      <div className="operation-display">
        {currentStep >= 0 && simulationRef.current.length > 0 && (
          <div className="operation-text">
            <p>{simulationRef.current[currentStep].operation}</p>
            <p>Value added: {simulationRef.current[currentStep].value}</p>
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

      <div className="explanation-section">
        <div className="card">
          <h3>How CPU Matrix Multiplication Works</h3>
          <p>
            In a traditional CPU implementation, matrix multiplication is performed using three nested loops:
          </p>
          <pre>
{`for i from 0 to n-1:
  for j from 0 to n-1:
    for k from 0 to n-1:
      C[i,j] += A[i,k] * B[k,j]`}
          </pre>
          <p>
            Each operation (multiply and accumulate) is executed sequentially, one at a time.
            For 8×8 matrices, this requires 8×8×8 = 512 sequential operations.
          </p>
          <p>
            The CPU is efficient for small matrices and general-purpose computation, 
            but this approach doesn't scale well for larger matrices used in 
            deep learning and other compute-intensive applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CpuVisualizer; 