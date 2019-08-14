import axios from 'axios';
import { RecordingType } from './type-enum';

export const startRecordingMicrophone = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({});

  try {
    const res = await axios.post('/api/recording', body, config);

    console.log(res);
    dispatch({
      type: RecordingType.START_RECORDING_MICROPHONE,
      payload: {}
    });
  } catch (err) {
    const errors = err.response.data.errors;

    console.log(errors);
  }

  setTimeout(
    () => dispatch({ type: RecordingType.STOP_RECORDING_MICROPHONE }),
    6000
  );
};
