import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RecordingType } from '../../actions/type-enum';

declare var MediaRecorder: any;

const sendRecording = async (dispatch, arrayBuffer) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=${data._boundary}'
    }
  };

  try {
    var formData: FormData = new FormData();
    formData.append('audio', arrayBuffer);

    const res = await axios.post(
      '/api/recording',
      { test: new Buffer(arrayBuffer) },
      config
    );

    console.log(res);
    dispatch({
      type: RecordingType.SEND_RECORDING,
      payload: {}
    });
  } catch (err) {
    //const errors = err.response.data.errors;

    console.log(err);
  }
};

const handleRecorder = dispatch => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    console.log('entra!!!!');
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    const audioChunks: any[] = [];
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', async () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      let arrayBuffer = await new Response(audioBlob).arrayBuffer();
      sendRecording(dispatch, arrayBuffer);
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 20000);
  });
};

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
  { sendRecording }
)(Recorder);
