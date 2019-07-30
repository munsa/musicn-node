import React from 'react';

const Landing = () => {
  return (
    <div>
      <div className='index'>
        <div className='container'>
          <div className='d-flex justify-content-center h-100'>
            <div className='card login-card'>
              <div className='login-form'>
                <form>
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
                      type='button'
                      className='btn btn-primary btn-lg btn-block'
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
