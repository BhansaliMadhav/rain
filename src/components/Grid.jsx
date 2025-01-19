import React, { useState, useEffect } from "react";
import "./Grid.css";

const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState([]);
  const [occupiedColumns, setOccupiedColumns] = useState(new Set()); // Track occupied columns

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

  // Function to generate a random color
  const getRandomColor = () => {
    const randomHue = Math.floor(Math.random() * 360); // Random color hue
    const randomSaturation = 80 + Math.floor(Math.random() * 20); // Saturation between 80% and 100%
    const randomLightness = 50 + Math.floor(Math.random() * 10); // Lightness between 50% and 60%
    return `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;
  };

  // Generate raindrops (every 300ms)
  useEffect(() => {
    const generateRaindropsInterval = 300; // 300ms for generating raindrops
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        const newOccupiedColumns = new Set(occupiedColumns); // Copy the current set of occupied columns

        // Function to generate 3 raindrops with sufficient gaps between them
        const generateRaindrops = () => {
          const availableColumns = [];
          for (let col = 0; col < cols; col++) {
            if (!newOccupiedColumns.has(col)) {
              availableColumns.push(col);
            }
          }

          if (availableColumns.length < 3) {
            return null; // Not enough available columns for 3 raindrops
          }

          // Select 3 random columns from the available ones, ensuring a gap of at least 2 blocks
          const selectedColumns = [];
          while (selectedColumns.length < 3) {
            const randomCol =
              availableColumns[
                Math.floor(Math.random() * availableColumns.length)
              ];
            const isGapEnough = selectedColumns.every(
              (col) => Math.abs(col - randomCol) > 2
            ); // Ensure at least 2 blocks gap

            if (!selectedColumns.includes(randomCol) && isGapEnough) {
              selectedColumns.push(randomCol);
              newOccupiedColumns.add(randomCol); // Mark the column as occupied
            }
          }

          return selectedColumns;
        };

        const columns = generateRaindrops(); // Get 3 random columns for raindrops

        if (columns !== null) {
          const raindropColor = getRandomColor(); // Random color for the raindrops
          let startRow = 0; // Raindrop starts from row 0

          // Fill 5 consecutive rows for each raindrop
          columns.forEach((startCol) => {
            for (let i = 0; i < 5; i++) {
              const row = startRow + i;
              if (row < rows) {
                const opacity = (i + 1) * 0.2; // Increase opacity for lower parts of the drop
                newGrid[row][startCol] = {
                  color: raindropColor, // Same color for all parts of the drop
                  opacity: opacity,
                };
              }
            }
          });
        }

        // Update the occupied columns state
        setOccupiedColumns(newOccupiedColumns);
        return newGrid;
      });
    }, generateRaindropsInterval); // Generate new raindrops every 300ms

    return () => clearInterval(interval);
  }, [rows, cols, occupiedColumns]);

  // Reset occupied columns periodically (every 5 seconds)
  useEffect(() => {
    const resetOccupiedColumnsInterval = 2500; // Reset every 5 seconds to avoid full occupation
    const interval = setInterval(() => {
      setOccupiedColumns(new Set()); // Reset occupied columns
    }, resetOccupiedColumnsInterval);

    return () => clearInterval(interval);
  }, []);

  // Animate raindrops (every 100ms)
  useEffect(() => {
    const moveRaindropsInterval = 100; // 100ms for animating movement
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());

        // Move raindrops down and clear the previous row
        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (newGrid[i][j]) {
              if (i < rows - 1) {
                newGrid[i + 1][j] = newGrid[i][j]; // Move drop down
              }
              newGrid[i][j] = null; // Clear previous position
            }
          }
        }

        return newGrid;
      });
    }, moveRaindropsInterval); // Move raindrops every 100ms

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
