import React, { useState, useEffect, useRef } from 'react';
import '../styles/Visualizer.css';
import MatrixEditor from './MatrixEditor';

const TpuVisualizer = () => {
  const [matrixA, setMatrixA] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [matrixB, setMatrixB] = useState(Array(8).fill().map(() => Array(8).fill(1)));
  const [peState, setPeState] = useState(
    Array(8).fill().map(() => 
      Array(8).fill().map(() => ({
        acc: 0,      // Accumulator value
        a_in: 0,     // Current a input
        b_in: 0,     // Current b input
        a_out: 0,    // Current a output (to right)
        b_out: 0,    // Current b output (down)
        active: false // Whether this PE is active
      }))
    )
  );
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  
  // Track all simulation steps
  const simulationRef = useRef([]);
  const timerRef = useRef(null);
  const totalCycles = 23; // Number of cycles to complete the computation: 8+8+7 = 23

  // Initialize the simulation steps
  useEffect(() => {
    // Reset simulation when matrices change
    setIsRunning(false);
    setCurrentStep(0);
    setCycleCount(0);

    const steps = [];
    
    // Create initial state: all PEs are inactive, all values are 0
    const initialState = Array(8).fill().map(() => 
      Array(8).fill().map(() => ({
        acc: 0, a_in: 0, b_in: 0, a_out: 0, b_out: 0, active: false
      }))
    );
    steps.push({
      peState: initialState,
      cycle: 0,
      description: "Initial state: Processing Elements are idle"
    });
    
    // Simulate cycles 1 through totalCycles
    for (let cycle = 1; cycle <= totalCycles; cycle++) {
      // Deep copy the previous state
      const prevState = steps[cycle-1].peState;
      const newState = prevState.map(row => row.map(pe => ({...pe})));
      
      // For each PE, calculate inputs based on the systolic pattern
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          // Calculate A input: from left border if j=0, otherwise from previous PE
          let a_in = 0;
          if (j === 0) {
            // For the leftmost column, check if we should feed from matrix A
            // Matrix A is fed row by row, with skew (row i starts at cycle i+1)
            if (cycle >= i+1 && cycle <= i + 8) {
              a_in = matrixA[i][cycle - i - 1];
            }
          } else {
            // For other PEs, get value from left neighbor
            a_in = prevState[i][j-1].a_out;
          }
          
          // Calculate B input: from top border if i=0, otherwise from PE above
          let b_in = 0;
          if (i === 0) {
            // For the top row, check if we should feed from matrix B
            // Matrix B is fed column by column, with skew (column j starts at cycle j+1)
            if (cycle >= j+1 && cycle <= j + 8) {
              b_in = matrixB[cycle - j - 1][j];
            }
          } else {
            // For other PEs, get value from neighbor above
            b_in = prevState[i-1][j].b_out;
          }
          
          // Update PE state
          newState[i][j] = {
            acc: prevState[i][j].acc + (a_in * b_in),
            a_in: a_in,
            b_in: b_in,
            a_out: a_in, // Pass A value to the right
            b_out: b_in, // Pass B value down
            active: a_in !== 0 || b_in !== 0 || prevState[i][j].active
          };
        }
      }
      
      // Store the state for this cycle
      steps.push({
        peState: newState,
        cycle: cycle,
        description: `Cycle ${cycle}: Data flows through the systolic array`
      });
    }
    
    simulationRef.current = steps;
  }, [matrixA, matrixB]);

  // Animation control
  useEffect(() => {
    if (isRunning && currentStep < totalCycles) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / speed);
    } else if (currentStep >= totalCycles) {
      setIsRunning(false);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentStep, speed, totalCycles]);

  // Update state when step changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationRef.current.length) {
      const step = simulationRef.current[currentStep];
      setPeState(step.peState);
      setCycleCount(step.cycle);
    }
  }, [currentStep]);

  const handleStart = () => {
    if (currentStep === totalCycles) {
      // Restart if we're at the end
      setCurrentStep(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < totalCycles) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
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
        <h1>TPU Systolic Array</h1>
        <p>Matrix multiplication using a hardware systolic array architecture</p>
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
          <button className="control-btn" onClick={handleStepForward} disabled={currentStep >= totalCycles}>
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
          <span>Cycle: {cycleCount} / {totalCycles}</span>
        </div>
      </div>

      <div className="operation-display">
        {currentStep >= 0 && simulationRef.current.length > 0 && (
          <div className="operation-text">
            <p>{simulationRef.current[currentStep]?.description}</p>
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
                <div key={`A-${i}-${j}`} className="matrix-cell">
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
                <div key={`B-${i}-${j}`} className="matrix-cell">
                  {cell}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      <h3 className="systolic-heading">Systolic Array Processing Elements</h3>
      <div className="systolic-array">
        {peState.map((row, i) => (
          row.map((pe, j) => (
            <div 
              key={`pe-${i}-${j}`} 
              className={`pe-cell ${pe.active ? 'active' : ''}`}
            >
              <div className="pe-acc">ACC: {pe.acc}</div>
              <div className="pe-inputs">
                <span>A: {pe.a_in}</span>
                <span>B: {pe.b_in}</span>
              </div>
              {pe.a_in > 0 && <div className="data-flow-indicator flow-right"></div>}
              {pe.b_in > 0 && <div className="data-flow-indicator flow-down"></div>}
            </div>
          ))
        ))}
      </div>

      <h3 className="systolic-heading">Result Matrix</h3>
      <div className="matrix-display">
        <div className="matrix-grid">
          {peState.map((row, i) => (
            row.map((pe, j) => (
              <div key={`result-${i}-${j}`} className="matrix-cell">
                {pe.acc}
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="explanation-section">
        <div className="card">
          <h3>How TPU Systolic Arrays Work</h3>
          <p>
            A systolic array is a specialized hardware architecture that excels at matrix multiplication.
            It consists of a grid of Processing Elements (PEs), each capable of performing a multiply-accumulate operation.
          </p>
          <p>
            Data flows through the array in a synchronized wave:
          </p>
          <ul>
            <li>Matrix A elements flow from left to right</li>
            <li>Matrix B elements flow from top to bottom</li>
            <li>Each PE multiplies its inputs and accumulates the result</li>
          </ul>
          <p>
            This design offers high computational efficiency because:
          </p>
          <ul>
            <li>Each data element is reused multiple times</li>
            <li>All PEs operate in parallel</li>
            <li>Minimal control logic is needed</li>
            <li>Data movement is minimized</li>
          </ul>
          <p>
            Google's Tensor Processing Units (TPUs) leverage this systolic design to accelerate 
            matrix operations for deep learning workloads, offering superior performance 
            and energy efficiency compared to CPUs and GPUs for these specific tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TpuVisualizer;