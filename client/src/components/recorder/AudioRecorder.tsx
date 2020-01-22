import React, { useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import AudioPlayer from './AudioPlayer';
import RecorderSuccessResultModal from './RecorderSuccessResultModal';
declare var MediaRecorder: any;
const AudioRecorder = () => {
  const [audioChunks, setAudioChunks] = React.useState([]);
  const [circles, setCircles] = React.useState(undefined);
  const [result, setResult] = React.useState(undefined);

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

        // Reset circles
        setCircles(undefined);

        // Stop audio tracks and context
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
          res.data.body = {
            metadata: {
              timestamp_utc: '2020-01-21 00:25:32',
              music: [
                {
                  play_offset_ms: 7020,
                  artists: [{ name: 'Flying Lotus' }],
                  lyrics: { copyrights: ['Warner/Chappell Music', 'Inc.'] },
                  acrid: '989740a9c31140a656e5b1a3ec916a49',
                  genres: [{ name: 'Electro' }],
                  album: { name: 'Never Catch Me (feat. Kendrick Lamar)' },
                  label: 'Warp Records',
                  external_ids: { isrc: 'GBBPW1400157', upc: '801061323639' },
                  result_from: 3,
                  contributors: { lyricists: ['STEVEN ELLISON'] },
                  title: 'Never Catch Me (feat. Kendrick Lamar)',
                  duration_ms: 234486,
                  score: 100,
                  external_metadata: {
                    deezer: {
                      track: {
                        name: 'Never Catch Me (feat. Kendrick Lamar)',
                        id: '84682095'
                      },
                      artists: [{ name: 'Flying Lotus', id: '15933' }],
                      album: {
                        name: 'Never Catch Me (feat. Kendrick Lamar)',
                        id: '8536929'
                      }
                    },
                    spotify: {
                      track: {
                        name: 'Never Catch Me',
                        id: '7j4meQkdoe8VcvVgApCxFe'
                      },
                      artists: [
                        { name: 'Flying Lotus', id: '29XOeO6KIWxGthejQqn793' },
                        { name: 'Kendrick Lamar', id: '2YZyLoL8N0Wb9xBt1NhZWg' }
                      ],
                      album: {
                        name: "You're Dead! (Deluxe)",
                        id: '3Y9XeEhhPyzFnCGDjKcVB0'
                      }
                    },
                    youtube: { vid: '2lXD0vv-ds8' }
                  },
                  release_date: '2014-09-04'
                }
              ]
            },
            cost_time: 0.42000007629395,
            status: { msg: 'Success', version: '1.0', code: 0 },
            result_type: 0
          };
          if (res.data.body.status.msg == 'Success') {
            setResult(res.data.body);
          }
        } catch (err) {
          // const errors = err.response.data.errors;
          console.log('error');
          console.log(err);
        }
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);
    });
  };

  return (
    <div>
      <AudioPlayer circles={circles} onPlayCallback={handleRecorder} />
      <RecorderSuccessResultModal result={result} />
    </div>
  );
};

export default connect()(AudioRecorder);
