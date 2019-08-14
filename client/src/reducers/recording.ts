import { RecordingType } from '../actions/type-enum';

export const initialState: any[] = [];

export default function(state = initialState, action) {
  const { type, payload, msg } = action;
  let hasType: boolean = false;
  switch (type) {
    case RecordingType.START_RECORDING_MICROPHONE:
      break;
    case RecordingType.STOP_RECORDING_MICROPHONE:
  }
  return state;
}
