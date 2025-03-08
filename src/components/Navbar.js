import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon
import GitHubImporter from './GitHubImporter';

const Navbar = () => {
  const [showGitHubImporter, setShowGitHubImporter] = useState(false);

  const handleFileSelect = (fileData) => {
    // Use the global function exposed by Landing component
    if (window.handleFileImport) {
      window.handleFileImport(fileData);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title">CodeAIx</div>
        <div className="navbar-buttons">
          <button 
            className="navbar-button github-button"
            onClick={() => setShowGitHubImporter(true)}
          >
            <FaGithub className="github-icon" /> Import
          </button>
          <button className="navbar-button">User</button>
        </div>
      </nav>

      {showGitHubImporter && (
        <GitHubImporter 
          onFileSelect={handleFileSelect}
          onClose={() => setShowGitHubImporter(false)}
        />
      )}
    </>
  );
};

export default Navbar;