import { RecordingType } from '../actions/type-enum';

export const initialState: any[] = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case RecordingType.SEND_RECORDING:
  }
  return state;
}
