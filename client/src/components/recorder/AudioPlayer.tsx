import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function AudioPlayer({ circles, onPlayCallback }) {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const a = 1;
    const b = a + 1;
    draw();
  }, [circles]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.2;
      circles.forEach(c => {
        ctx.fillStyle = c.colour;
        ctx.beginPath();
        ctx.arc(200, 200, c.radius, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  return (
    <div>
      <div>
        <button id='startButton' onClick={() => onPlayCallback()} />
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}

AudioPlayer.defaultProps = {
  circles: [
    { colour: '#581845', radius: 50 },
    { colour: '#900C3F', radius: 60 },
    { colour: '#C70039', radius: 70 },
    { colour: '#FF5733', radius: 80 },
    { colour: '#FFC300', radius: 90 },
    { colour: '#DAF7A6', radius: 100 }
  ]
};

AudioPlayer.propTypes = {
  circles: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      radius: PropTypes.number.isRequired
    })
  ).isRequired
};

export default connect()(AudioPlayer);
