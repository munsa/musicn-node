import { LoginAlertType } from '../actions/type-enum';

export const initialState: any[] = [];

export default function(state = initialState, action) {
  const { type, payload } = action;
  let hasType: boolean = false;
  switch (type) {
    case LoginAlertType.SET_LOGIN_ALERT:
      state.forEach(loginAlert => {
        if (loginAlert.typeCode === type) {
          hasType = true;
          return;
        }
      });
      if (!hasType) {
        return [...state, payload];
      }
    case LoginAlertType.REMOVE_LOGIN_ALERT:
      return state.filter(loginAlert => loginAlert.id !== payload);
  }
  return initialState;
}
