import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setLoginAlert } from '../../actions/login-alert';
import { register } from '../../actions/auth';
import LoginAlert from '../layout/LoginAlert';
import PropTypes from 'prop-types';

const Register = ({ setLoginAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordRepeat: ''
  });

  const { username, email, password, passwordRepeat } = formData;

  function onChange(event: any) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function onSubmit(event: any) {
    event.preventDefault();
    if (password !== passwordRepeat) {
      setLoginAlert('Passwords do not match', 'danger');
    } else {
      register({ username, email, password });
    }
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
                    <i className='fa fa-user' />
                    <input
                      type='text'
                      className='form-control text-input'
                      placeholder='Username'
                      name='username'
                      value={username}
                      onChange={e => onChange(e)}
                    />
                  </div>
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
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <div className='inner-addon left-addon'>
                    <i className='fa fa-unlock-alt' />
                    <input
                      type='password'
                      className='form-control text-input'
                      placeholder='Repeat password'
                      name='passwordRepeat'
                      value={passwordRepeat}
                      onChange={e => onChange(e)}
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
                    Register
                  </button>
                </div>
                Already have an account? <Link to='/login'>Login</Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

Register.protoTypes = {
  setLoginAlert: PropTypes.func.isRequired,
  register: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setLoginAlert, register }
)(Register);
