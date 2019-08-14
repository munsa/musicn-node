import { combineReducers } from 'redux';
import loginAlert from './login-alert';
import auth from './auth';
import recording from './recording';

export default combineReducers({
  loginAlert,
  auth,
  recording
});
