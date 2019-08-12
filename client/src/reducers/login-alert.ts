import { LoginAlertType } from '../actions/type-enum';

export const initialState: any[] = [];

export default function(state = initialState, action) {
  const { type, payload, msg } = action;
  let hasType: boolean = false;
  switch (type) {
    case LoginAlertType.SET_LOGIN_ALERT:
      state.forEach(loginAlert => {
        if (loginAlert.msg === msg) {
          hasType = true;
          return;
        }
      });
      if (!hasType) {
        return [...state, payload];
      }
      break;
    case LoginAlertType.REMOVE_LOGIN_ALERT:
      return state.filter(loginAlert => loginAlert.id !== payload);
  }
  return state;
}
