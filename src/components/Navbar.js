import React, { useState } from 'react';
import GitHubImporter from './GitHubImporter';

const Navbar = ({ onFileImport }) => {
  const [showGitHubImporter, setShowGitHubImporter] = useState(false);

  const handleFileSelect = (fileData) => {
    // Pass the file data to parent component to update the editor
    if (onFileImport) {
      onFileImport(fileData);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-title">CodeAIx</div>
        <div className="navbar-buttons">
          <button 
            className="navbar-button"
            onClick={() => setShowGitHubImporter(true)}
          >
            GitHub Import
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