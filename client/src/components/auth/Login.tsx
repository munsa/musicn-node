import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  function onChange(event: any) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function onSubmit(event: any) {
    event.preventDefault();
    const loginUser = {
      email,
      password
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const body = JSON.stringify(loginUser);

      const res = await axios.post('api/auth', body, config);
      console.log(res.data);

      //TODO: TEST
      const config2 = {
        headers: {
          'x-auth-token': res.data.token
        }
      };
      const res2 = await axios.get('api/users', config2);
      console.log(res2.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  return (
    <Fragment>
      <div className='index'>
        <div className='d-flex justify-content-center h-100'>
          <div className='card login-card'>
            <div className='login-form'>
              <form onSubmit={e => onSubmit(e)}>
                <div className='form-group text-center'>
                  <h1>OwlTown</h1>
                </div>
                <div className='form-group'>
                  <div className='inner-addon left-addon'>
                    <i className='fa fa-envelope' />
                    <input
                      type='email'
                      className='form-control text-input'
                      placeholder='Email'
                      name='email'
                      value={email}
                      onChange={e => onChange(e)}
                      required
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <div className='inner-addon left-addon'>
                    <i className='fa fa-unlock-alt' />
                    <input
                      type='password'
                      className='form-control text-input'
                      placeholder='Password'
                      name='password'
                      value={password}
                      onChange={e => onChange(e)}
                      required
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <input type='checkbox' className='align-middle' />
                  <div className='d-inline remember-text align-middle'>
                    Remember Me
                  </div>
                </div>
                <div className='form-group'>
                  <button
                    type='submit'
                    className='btn btn-primary btn-lg btn-block'
                  >
                    Login
                  </button>
                </div>
                You don't have an account yet?{' '}
                <Link to='/register'>Register</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
