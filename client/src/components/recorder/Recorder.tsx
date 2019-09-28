import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {RecordingType} from '../../actions/type-enum';

declare var MediaRecorder: any;

const handleRecorder = async(dispatch) => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: any[] = [];

    // Start recording
    mediaRecorder.start();
    console.log('Start recording');

    // Save data
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    // Stop recording
    mediaRecorder.addEventListener('stop', async () => {
      console.log('Stop recording');
      const audioBlob = new Blob(audioChunks, {type: 'audio/x-wav'});

      const config = { headers: { 'Content-Type': 'multipart/form-data; boundary=${data._boundary}' } };

      try {
        const res = await axios.post(
            '/api/recording',
            audioBlob,
            config
        );

        console.log(res.data);

        /*dispatch({
          type: RecordingType.SEND_RECORDING,
          payload: {}
        });*/
      } catch (err) {
        // const errors = err.response.data.errors;
        console.log('error');
        console.log(err);
      }
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 2000);
  });
};

// Download audio
// Useful for developing purposes
function downloadAudio(audioBlob: Blob): void {
  const url = window.URL.createObjectURL(audioBlob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.setAttribute('download', 'audio.wav');
  a.click();
  window.URL.revokeObjectURL(url);
}

const Recorder = () => {
  return (
      <div>
        <button className='btn' onClick={handleRecorder}>
          <i className='fa fa-microphone' title='Record' />
        </button>
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

export default connect(
    mapStateToProps,
    { handleRecorder }
)(Recorder);
