import React from 'react';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark'>
      <a className='navbar-brand' href='#'>
        OwlTown
      </a>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <a className='nav-link' href='index.html'>
              Menu1
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='index.html'>
              Menu2
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='index.html'>
              Menu3
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
