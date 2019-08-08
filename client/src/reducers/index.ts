import { combineReducers } from 'redux';
import loginAlert from './login-alert';
import auth from './auth';

export default combineReducers({
  loginAlert,
  auth
});
