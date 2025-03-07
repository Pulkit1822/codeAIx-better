import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">CodeAIx</div>
      <div className="navbar-buttons">
        <button className="navbar-button">GitHub Import</button>
        <button className="navbar-button">User</button>
      </div>
    </nav>
  );
};

export default Navbar;