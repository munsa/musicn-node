import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RecordingType } from '../../actions/type-enum';
import fs from 'fs';
import path from 'path';

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
      { audio: new Buffer(new Uint8Array(arrayBuffer)) },
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
      console.log(audioChunks);
      const audioBlob = new Blob(audioChunks, {type: 'audio/x-wav'});
      const audioUrl = URL.createObjectURL(audioBlob);
      let arrayBuffer = await new Response(audioBlob).arrayBuffer();

      var reader  = new FileReader();
      reader.onloadend = function () {
        console.log(reader.result);
      }
      reader.readAsDataURL(audioBlob);


    console.log(audioBlob.type);
      // Download audio
      var url = window.URL.createObjectURL(audioBlob);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.setAttribute('download', 'audio.wav');
      a.click();
      window.URL.revokeObjectURL(url);

      await sendRecording(dispatch, arrayBuffer);

      /*const audio = new Audio(audioUrl);
      audio.play();*/
    });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
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
