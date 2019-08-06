import uuid from 'uuid';
import { LoginAlertType } from './type-enum';

export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: LoginAlertType.SET_LOGIN_ALERT,
    payload: { msg, alertType, id }
  });
};
