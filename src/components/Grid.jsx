import React, { useState, useEffect } from "react";
import "./Grid.css";

const Grid = ({ rows, cols }) => {
  // State to store the grid
  const [grid, setGrid] = useState([]);

  // State to track occupied columns
  const [occupiedColumns, setOccupiedColumns] = useState(new Set());

  useEffect(() => {
    const createInitialGrid = () => {
      const newGrid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => null)
      );
      setGrid(newGrid);
    };
    createInitialGrid();
  }, [rows, cols]);

  const getRandomColor = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomSaturation = 80 + Math.floor(Math.random() * 20);
    const randomLightness = 50 + Math.floor(Math.random() * 10);
    return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
  };

  useEffect(() => {
    const generateRaindropsInterval = 600;
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        const newOccupiedColumns = new Set(occupiedColumns);

        const generateRaindrops = () => {
          const availableColumns = [];
          for (let col = 0; col < cols; col++) {
            if (!newOccupiedColumns.has(col)) {
              availableColumns.push(col);
            }
          }

          if (availableColumns.length < 3) {
            return null;
          }

          const selectedColumns = [];
          while (selectedColumns.length < 3) {
            const randomCol =
              availableColumns[
                Math.floor(Math.random() * availableColumns.length)
              ];
            const isGapEnough = selectedColumns.every(
              (col) => Math.abs(col - randomCol) > 2
            );

            if (!selectedColumns.includes(randomCol) && isGapEnough) {
              selectedColumns.push(randomCol);
              newOccupiedColumns.add(randomCol);
            }
          }

          return selectedColumns;
        };

        const columns = generateRaindrops();

        if (columns !== null) {
          const raindropColor = getRandomColor();
          let startRow = 0;

          columns.forEach((startCol) => {
            for (let i = 0; i < 5; i++) {
              const row = startRow + i;
              if (row < rows) {
                const opacity = (i + 1) * 0.2;
                newGrid[row][startCol] = {
                  color: raindropColor,
                  opacity: opacity,
                };
              }
            }
          });
        }

        setOccupiedColumns(newOccupiedColumns);
        return newGrid;
      });
    }, generateRaindropsInterval);

    return () => clearInterval(interval);
  }, [rows, cols, occupiedColumns]);

  useEffect(() => {
    const resetOccupiedColumnsInterval = 3600;
    const interval = setInterval(() => {
      setOccupiedColumns(new Set());
    }, resetOccupiedColumnsInterval);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveRaindropsInterval = 200;
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());

        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (newGrid[i][j]) {
              if (i < rows - 1) {
                newGrid[i + 1][j] = newGrid[i][j];
              }
              newGrid[i][j] = null;
            }
          }
        }

        return newGrid;
      });
    }, moveRaindropsInterval);

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
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="cell"
            style={{
              backgroundColor: cell ? cell.color : "transparent",
              opacity: cell ? cell.opacity : 0,
            }}
          ></div>
        ))
      )}
    </div>
  );
};

export default Grid;
