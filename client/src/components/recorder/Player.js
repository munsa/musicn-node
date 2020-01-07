import React from 'react';
import soundFile from './nevercatch.mp3';

export default function VisualDemo(props) {
  var audioData;

  const initializeAudioAnalyser = () => {
    const audioFile = new Audio();
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioFile);
    const analyser = audioContext.createAnalyser();
    audioFile.src = soundFile;
    analyser.fftSize = 64;
    source.connect(audioContext.destination);
    source.connect(analyser);
    audioFile.play();
    audioData = analyser;
  };

  const getFrequencyData = styleAdjuster => {
    const bufferLength = 6;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  };

  const canvasRef = React.useRef(null);

  function adjustFreqBandStyle(newAmplitudeData) {
    const canvas = canvasRef.current;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (var i = 0; i < newAmplitudeData.length; i++) {
      if (i === 0) {
        ctx.fillStyle = '#581845';
      } else if (i === 1) {
        ctx.fillStyle = '#900C3F';
      } else if (i === 2) {
        ctx.fillStyle = '#C70039';
      } else if (i === 3) {
        ctx.fillStyle = '#FF5733';
      } else if (i === 4) {
        ctx.fillStyle = '#FFC300';
      } else if (i === 5) {
        ctx.fillStyle = '#DAF7A6';
      }

      ctx.beginPath();
      ctx.arc(200, 200, 50 + (newAmplitudeData[i] / 255) * 80, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function runSpectrum() {
    getFrequencyData(adjustFreqBandStyle);
    requestAnimationFrame(runSpectrum);
  }

  function handleStartBottonClick() {
    initializeAudioAnalyser();
    requestAnimationFrame(runSpectrum);
  }

  return (
    <div>
      <div>
        <button id='startButton' onClick={() => handleStartBottonClick()} />
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}
