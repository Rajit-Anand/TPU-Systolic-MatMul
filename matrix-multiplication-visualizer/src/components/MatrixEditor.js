import React, { useState } from 'react';
import '../styles/MatrixEditor.css';

const MatrixEditor = ({ matrix, onMatrixChange, matrixName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMatrix, setEditMatrix] = useState(matrix.map(row => [...row]));

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newValue = parseInt(value) || 0;
    const newMatrix = editMatrix.map(row => [...row]);
    newMatrix[rowIndex][colIndex] = newValue;
    setEditMatrix(newMatrix);
  };

  const handleSave = () => {
    onMatrixChange(editMatrix);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMatrix(matrix.map(row => [...row]));
    setIsEditing(false);
  };

  const applyPreset = (preset) => {
    let presetMatrix;
    
    switch(preset) {
      case 'identity':
        presetMatrix = Array(8).fill().map((_, i) => 
          Array(8).fill().map((_, j) => i === j ? 1 : 0)
        );
        break;
      case 'ones':
        presetMatrix = Array(8).fill().map(() => Array(8).fill(1));
        break;
      case 'random':
        presetMatrix = Array(8).fill().map(() => 
          Array(8).fill().map(() => Math.floor(Math.random() * 10))
        );
        break;
      case 'checkerboard':
        presetMatrix = Array(8).fill().map((_, i) => 
          Array(8).fill().map((_, j) => (i + j) % 2 === 0 ? 1 : 0)
        );
        break;
      default:
        presetMatrix = matrix;
    }
    
    if (isEditing) {
      setEditMatrix(presetMatrix);
    } else {
      onMatrixChange(presetMatrix);
    }
  };

  return (
    <div className="matrix-editor">
      <div className="matrix-editor-header">
        <h3>Matrix {matrixName}</h3>
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="matrix-edit-grid">
          {editMatrix.map((row, i) => (
            row.map((cell, j) => (
              <input
                key={`edit-${i}-${j}`}
                type="number"
                value={cell}
                onChange={(e) => handleCellChange(i, j, e.target.value)}
                className="matrix-edit-cell"
              />
            ))
          ))}
        </div>
      ) : (
        <div className="matrix-grid">
          {matrix.map((row, i) => (
            row.map((cell, j) => (
              <div key={`display-${i}-${j}`} className="matrix-cell">
                {cell}
              </div>
            ))
          ))}
        </div>
      )}
      
      <div className="matrix-presets">
        <span>Presets: </span>
        <button onClick={() => applyPreset('identity')}>Identity</button>
        <button onClick={() => applyPreset('ones')}>All Ones</button>
        <button onClick={() => applyPreset('random')}>Random</button>
        <button onClick={() => applyPreset('checkerboard')}>Checkerboard</button>
      </div>
    </div>
  );
};

export default MatrixEditor; 