import React from 'react';

const Navbar = () => {
  return (
    <nav className='navbar navbar-expand-lg'>
      <a className='navbar-brand' href='#'>
        Navbar
      </a>
      <a href='index.html'>Owl Town</a>
      <div className='collapse navbar-collapse' id='navbarSupportedContent'>
        <ul>
          <li>
            <a href='index.html'>Menu1</a>
          </li>
          <li>
            <a href='index.html'>Menu2</a>
          </li>
          <li>
            <a href='index.html'>Menu3</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
