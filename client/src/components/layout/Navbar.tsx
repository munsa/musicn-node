import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark'>
      <Link className='navbar-brand' to='/'>
        OwlTown
      </Link>
      <ul className='navbar-nav mr-auto'>
        <li className='nav-item'>
          <Link className='nav-link' to='/register'>
            Register
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/login'>
            Login
          </Link>
        </li>
        <li className='nav-item'>
          <Link className='nav-link' to='/home'>
            Home
          </Link>
        </li>
      </ul>
      <ul className='nav navbar-nav navbar-right'>
        <li className='nav-item dropdown'>
          <a
            className='nav-link dropdown-toggle'
            id='navbarDropdownMenuLink'
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded='false'
            href='/'
          >
            <i className='fa fa-bars' />
          </a>
          <div className='dropdown-menu'>
            <Link className='dropdown-item' to='#'>
              <i className='fa fa-unlock-alt'>Profile</i>
            </Link>
            <Link className='dropdown-item' to='#'>
              <i className='fa fa-unlock-alt'>Settings</i>
            </Link>
            <Link className='dropdown-item' to='#'>
              <i className='fa fa-unlock-alt'>Logout</i>
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
