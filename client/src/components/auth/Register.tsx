import React, { Fragment, useState } from 'react';

const Register = () => {
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

  function onSubmit(event: any) {
    event.preventDefault();
    if (password !== passwordRepeat) {
      console.log('Passwords do not match');
    } else {
      console.log(formData);
    }
  }

  return (
    <Fragment>
      <div className='index'>
        <div className='container'>
          <div className='d-flex justify-content-center h-100'>
            <div className='card login-card'>
              <div className='login-form'>
                <form onSubmit={e => onSubmit(e)}>
                  <div className='form-group text-center'>
                    <h1>OwlTown</h1>
                  </div>
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
                        required
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
                    <div className='inner-addon left-addon'>
                      <i className='fa fa-unlock-alt' />
                      <input
                        type='password'
                        className='form-control text-input'
                        placeholder='Repeat password'
                        name='passwordRepeat'
                        value={passwordRepeat}
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
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
