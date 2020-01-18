import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AudioPlayer = ({ circles, onPlayCallback }) => {
  useEffect(() => {
    draw();
  }, [circles]);

  const canvasRef = React.useRef(null);

  // Draw circles
  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.2;
      circles.forEach(c => {
        ctx.fillStyle = c.colour;
        ctx.beginPath();
        ctx.arc(75, 75, 20 + (c.radius / 255) * 50, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  return (
    <div className='audio-player' onClick={() => onPlayCallback()}>
      <div className='audio-player-button-container'>
        <button className='audio-player-invisible-button' />
      </div>
      <div className='audio-player-button-container'>
        <i className='audio-player-button fa fa-2x fa-microphone'></i>
      </div>

      <canvas
        className='audio-player-canvas'
        ref={canvasRef}
        width='150'
        height='150'
      />
    </div>
  );
};

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
      color: PropTypes.string,
      radius: PropTypes.number
    })
  )
};

export default connect()(AudioPlayer);
