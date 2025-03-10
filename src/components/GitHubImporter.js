import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa'; // Import GitHub icon
import { fetchGitHubRepo, fetchGitHubFile } from '../utils/fetchGitHubRepo';

const GitHubImporter = ({ onFileSelect, onClose }) => {
  const [token, setToken] = useState(localStorage.getItem('github_token') || '');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [path, setPath] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTokenChange = (e) => {
    const newToken = e.target.value;
    setToken(newToken);
    localStorage.setItem('github_token', newToken);
  };

  const handleFetchRepo = async () => {
    if (!owner || !repo) {
      setError('Please enter both owner and repository name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await fetchGitHubRepo(owner, repo, path, token);
      setContents(Array.isArray(data) ? data : [data]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch repository data. Please check your inputs and token.');
      setLoading(false);
    }
  };

  const handlePathChange = async (newPath, isFile) => {
    if (isFile) {
      setLoading(true);
      try {
        const fileData = await fetchGitHubFile(owner, repo, newPath, token);
        onFileSelect(fileData);
        onClose(); // Close the importer after successful selection
      } catch (err) {
        setError('Failed to fetch file content');
        setLoading(false);
      }
    } else {
      setPath(newPath);
      setLoading(true);
      try {
        const data = await fetchGitHubRepo(owner, repo, newPath, token);
        setContents(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (err) {
        setError('Failed to navigate to the selected directory');
        setLoading(false);
      }
    }
  };

  return (
    <div className="github-importer">
      <div className="importer-header">
        <div className="importer-title">
          <FaGithub className="github-icon" />
          <span>Import</span>
        </div>
        <button className="navbar-button" onClick={onClose}>Close</button>
      </div>
      
      <div className="importer-form">
        
        <div className="form-group">
          <label>Repository Owner:</label>
          <input 
            type="text" 
            value={owner} 
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g., facebook" 
          />
        </div>
        
        <div className="form-group">
          <label>Repository Name:</label>
          <input 
            type="text" 
            value={repo} 
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g., react" 
          />
        </div>
        
        <button className="navbar-button" onClick={handleFetchRepo} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Repository'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="current-path">
        {owner}/{repo}/{path}
      </div>
      
      {/* Repository contents */}
      <div className="repo-contents">
        {loading ? <div>Loading...</div> : (
          <>
            {path && (
              <div 
                className="repo-item" 
                onClick={() => handlePathChange(path.split('/').slice(0, -1).join('/') || '', false)}
              >
                ../ (Go up)
              </div>
            )}
            {contents.map(item => (
              <div 
                key={item.path} 
                className="repo-item"
                onClick={() => handlePathChange(item.path, item.type === 'file')}
              >
                {item.type === 'dir' ? '📁 ' : '📄 '}{item.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubImporter;