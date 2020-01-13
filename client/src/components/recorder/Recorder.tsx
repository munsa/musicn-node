import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RecordingType } from '../../actions/type-enum';
let soundFile = require('./nevercatch.mp3');
declare var MediaRecorder: any;

const Recorder = () => {
  const [audioUrl, setAudioUrl] = React.useState('');

  const handleRecorder = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      var mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      // Start recording
      mediaRecorder.start(10);
      console.log('Start recording');

      // Frequency
      const audioContext = new AudioContext();
      const audioFile = new Audio();
      audioFile.src = audioUrl;
      const source = audioContext.createMediaStreamSource(stream);

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source.connect(audioContext.destination);
      source.connect(analyser);
      audioFile.play();
      audioData = analyser;

      draw();

      // Save data
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
        setAudioUrl(
          window.URL.createObjectURL(
            new Blob(audioChunks, { type: 'audio/x-wav' })
          )
        );
      });

      // Stop recording
      mediaRecorder.addEventListener('stop', async () => {
        console.log('Stop recording');
        const audioBlob = new Blob(audioChunks, { type: 'audio/x-wav' });

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data; boundary=${data._boundary}'
          }
        };

        try {
          const res = await axios.post('/api/recording', audioBlob, config);
        } catch (err) {
          // const errors = err.response.data.errors;
          console.log('error');
          console.log(err);
        }
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 8000);
    });
  };

  // Download audio
  // Useful for developing purposes
  const downloadAudio = (audioBlob: Blob) => {
    const url = window.URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.setAttribute('download', 'audio.wav');
    a.click();
    window.URL.revokeObjectURL(url);
  };

  var audioData;
  const canvasRef = React.useRef(null);

  const getFrequencyData = () => {
    const bufferLength = 6;
    const amplitudeArray = new Uint8Array(bufferLength);
    audioData.getByteFrequencyData(amplitudeArray);
    adjustFreqBandStyle(amplitudeArray);
  };

  const adjustFreqBandStyle = newAmplitudeData => {
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
      ctx.arc(
        200,
        200,
        10 + (6 - i) * 5 + (newAmplitudeData[i] / 255) * 50,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  const draw = () => {
    getFrequencyData();
    requestAnimationFrame(draw);
  };

  return (
    <div>
      <div>
        <button id='startButton' onClick={() => handleRecorder()} />
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

Recorder.proTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Recorder);
