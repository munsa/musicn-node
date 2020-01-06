import React from 'react';
import './waveform.css';

function draw(ctx, location) {
  ctx.beginPath();
  ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.save();
  ctx.restore();
}

function Waveform() {
  const [locations, setLocations] = React.useState([]);
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, window.innerHeight, window.innerWidth);
    locations.forEach(location => draw(ctx, location));
  });

  function handleCanvasClick(e) {
    const newLocation = { x: e.clientX, y: e.clientY };
    setLocations([...locations, newLocation]);
  }

  function handleClear() {
    setLocations([]);
  }

  function handleUndo() {
    setLocations(locations.slice(0, -1));
  }

  return (
    <>
      <div className='controls'>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
}
export default Waveform;
