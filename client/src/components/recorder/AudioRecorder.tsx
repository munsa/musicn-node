import React, { useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AudioPlayer from './AudioPlayer';
declare var MediaRecorder: any;

const AudioRecorder = () => {
  const [audioUrl, setAudioUrl] = React.useState('');
  const [circles, setCircles] = React.useState([]);

  var audioData;

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

      //draw();

      // Save data
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
        setAudioUrl(
          window.URL.createObjectURL(
            new Blob(audioChunks, { type: 'audio/x-wav' })
          )
        );

        const bufferLength = 6;
        const amplitudeArray = new Uint8Array(bufferLength);
        audioData.getByteFrequencyData(amplitudeArray);
        const colours = [
          '#581845',
          '#900C3F',
          '#C70039',
          '#FF5733',
          '#FFC300',
          '#DAF7A6'
        ];
        const c = [];
        for (var i = 0; i < bufferLength; i++) {
          let circle = {
            colour: colours[i],
            radius: amplitudeArray[i]
          };
          c.push(circle);
        }
        setCircles(c);

        // audioData.getByteFrequencyData(amplitudeArray);
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

  const onPlayCallback = () => {
    handleRecorder();
  };

  return (
    <div>
      <AudioPlayer circles={circles} onPlayCallback={onPlayCallback} />
    </div>
  );
};

export default connect()(AudioRecorder);
