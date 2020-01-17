import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import AudioPlayer from './AudioPlayer';
declare var MediaRecorder: any;

const AudioRecorder = () => {
  const [audioChunks, setAudioChunks] = React.useState([]);
  const [circles, setCircles] = React.useState(undefined);

  const handleRecorder = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      var mediaRecorder = new MediaRecorder(stream);
      setAudioChunks([]);

      // Initialize audio context
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      // Start recording
      mediaRecorder.start(10);
      console.log('Start recording');

      // Get data
      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);

        // Get frequency values
        const bufferLength = 6;
        const amplitudeArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(amplitudeArray);

        // Construct circle objects
        const c = [];
        const colours = [
          '#581845',
          '#900C3F',
          '#C70039',
          '#FF5733',
          '#FFC300',
          '#DAF7A6'
        ];
        for (var i = 0; i < bufferLength; i++) {
          let circle = {
            colour: colours[i],
            radius: amplitudeArray[i]
          };
          c.push(circle);
        }
        setCircles(c);
      });

      // Stop recording
      mediaRecorder.addEventListener('stop', async () => {
        console.log('Stop recording');

        //Stop audio tracks and context
        stream.getAudioTracks().forEach(track => {
          track.stop();
        });
        audioContext.close();

        // Create Audio Blob and send to server
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

  return (
    <div>
      <AudioPlayer circles={circles} onPlayCallback={handleRecorder} />
    </div>
  );
};

export default connect()(AudioRecorder);
