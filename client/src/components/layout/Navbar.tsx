import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { loading, isAuthenticated, user }, logout }) => {
  const navbarLinks = (
    <div>
      <ul className='nav navbar-nav navbar-right'>
        <li className='nav-item dropdown'>
          <a onClick={logout} href='#!' className='nav-link'>
            <img
              src={
                !loading && isAuthenticated && user !== null ? user.avatar : ''
              }
              className='rounded-circle'
              alt='Cinque Terre'
              width='30'
              height='30'
            />
            {!loading && isAuthenticated && user !== null ? user.username : ''}
          </a>
        </li>
        <li className='nav-item dropdown'>
          <a onClick={logout} href='#!' className='nav-link'>
            <i className='fa fa-sign-out' title='Logout' />
          </a>
        </li>
      </ul>
    </div>
  );
  return (
    <nav className='navbar navbar-expand-lg navbar-dark'>
      <Link className='navbar-brand' to='/'>
        OwlTown
      </Link>
      <ul className='navbar-nav mr-auto' />

      {!loading && isAuthenticated && <Fragment>{navbarLinks}</Fragment>}
    </nav>
  );
};

Navbar.proTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
