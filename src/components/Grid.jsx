import React, { useState, useEffect } from "react";
import "./Grid.css";

const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState([]);

  // Create the initial grid
  useEffect(() => {
    const createInitialGrid = () => {
      const newGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => null)
      );
      setGrid(newGrid);
    };
    createInitialGrid();
  }, [rows, cols]);

  // Animate raindrops
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());

        // Move raindrops down
        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (i === 0) {
              newGrid[i][j] =
                Math.random() < 0.05
                  ? `hsl(${Math.random() * 360}, 80%, 60%)`
                  : null;
            } else {
              newGrid[i][j] = newGrid[i - 1][j];
            }
          }
        }
        return newGrid;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [rows, cols]);

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 20px)`,
        gridTemplateRows: `repeat(${rows}, 20px)`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="cell"
            style={{ backgroundColor: color || "transparent" }}
          ></div>
        ))
      )}
    </div>
  );
};

export default Grid;
