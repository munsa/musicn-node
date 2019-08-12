import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setLoginAlert } from '../../actions/login-alert';
import LoginAlert from '../layout/LoginAlert';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
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
    login(email, password);
  }

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/' />;
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
                <LoginAlert />
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
                Don't have an account yet? <Link to='/register'>Register</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Login.protoTypes = {
  setLoginAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setLoginAlert, login }
)(Login);
