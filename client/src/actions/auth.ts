import axios from 'axios';
import { RegisterType } from './type-enum';
import { setLoginAlert } from './login-alert';

// Register User
export const register = ({ username, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ username, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: RegisterType.REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setLoginAlert(error.msg, 'danger')));
    }
    dispatch({ type: RegisterType.REGISTER_FAIL });
  }
};
