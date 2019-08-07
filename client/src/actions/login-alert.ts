import uuid from 'uuid';
import { LoginAlertType } from './type-enum';

export const setLoginAlert = (msg, loginAlertType) => dispatch => {
  const id = uuid.v4();
  const typeCode = LoginAlertType.SET_LOGIN_ALERT;
  dispatch({
    type: LoginAlertType.SET_LOGIN_ALERT,
    payload: { msg, loginAlertType, id, typeCode }
  });

  setTimeout(
    () => dispatch({ type: LoginAlertType.REMOVE_LOGIN_ALERT, payload: id }),
    6000
  );
};
