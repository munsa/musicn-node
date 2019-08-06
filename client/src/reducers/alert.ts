import { LoginAlertType } from '../actions/type-enum';

export const initialState: any[] = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LoginAlertType.SET_LOGIN_ALERT:
      return [...state, payload];
    case LoginAlertType.REMOVE_LOGIN_ALERT:
      return state.filter(alert => alert.id !== payload);
  }
  return initialState;
}
