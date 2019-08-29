import axios from 'axios';
import { RecordingType } from './type-enum';

export const sendRecording = () => async dispatch => {
  console.log('aqui tambien');
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({});

  try {
    console.log('send');
    const res = await axios.post('/api/recording', body, config);

    console.log(res);
    dispatch({
      type: RecordingType.SEND_RECORDING,
      payload: {}
    });
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(errors);
  }
};
