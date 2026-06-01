import React, { useState } from "react";

function TilesCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [tileSize, setTileSize] = useState("");
  const [boxes, setBoxes] = useState(null);

  const handleCalculate = () => {
    if (!length || !width || !tileSize) return;

    const roomArea = parseFloat(length) * parseFloat(width);
    const tileArea = parseFloat(tileSize) * parseFloat(tileSize);
    const tilesNeeded = roomArea / tileArea;
    const boxesNeeded = Math.ceil(tilesNeeded / 10); // assume 10 tiles per box
    setBoxes(boxesNeeded);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Tiles Calculator</h2>
      <input
        type="number"
        placeholder="Room Length (ft)"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Room Width (ft)"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Tile Size (ft)"
        value={tileSize}
        onChange={(e) => setTileSize(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Calculate
      </button>

      {boxes !== null && (
        <p className="mt-4 text-center text-lg">
          You need approximately <strong>{boxes}</strong> box(es) of tiles.
        </p>
      )}
    </div>
  );
}

export default TilesCalculator;
