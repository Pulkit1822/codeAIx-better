import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaGithub, FaSearch, FaFolder, FaFile, FaChevronLeft } from 'react-icons/fa';
import Select from 'react-select';
import { customStyles } from '../constants/customStyles';

const GitHubImporter = ({ onFileSelect, onClose }) => {
  const [token, setToken] = useState(localStorage.getItem('github_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoContents, setRepoContents] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [pathHistory, setPathHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Authenticate with GitHub token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${token}`
          }
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          localStorage.setItem('github_token', token);
        }
      } catch (err) {
        setError('Invalid token. Please try again.');
        localStorage.removeItem('github_token');
        setToken('');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Search repositories
  const searchRepositories = async () => {
    if (!searchQuery) return;
    
    try {
      setIsLoading(true);
      setError('');
      const headers = token ? { Authorization: `token ${token}` } : {};
      
      const response = await axios.get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc`,
        { headers }
      );
      
      setRepositories(response.data.items.map(repo => ({
        id: repo.id,
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url,
        apiUrl: repo.url,
        contentsUrl: repo.contents_url.replace('{+path}', '')
      })));
    } catch (err) {
      setError('Error searching repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get repository contents
  const fetchRepoContents = async (repo, path = '') => {
    try {
      setIsLoading(true);
      setError('');
      const headers = token ? { Authorization: `token ${token}` } : {};
      
      const response = await axios.get(
        `${repo.contentsUrl}${path}`,
        { headers }
      );
      
      setRepoContents(response.data);
      setCurrentPath(path);
      
      if (path && !pathHistory.includes(path)) {
        setPathHistory([...pathHistory, path]);
      }
    } catch (err) {
      setError('Error fetching repository contents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a repository
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setPathHistory([]);
    fetchRepoContents(repo);
  };

  // Navigate to a folder
  const navigateToFolder = (path) => {
    fetchRepoContents(selectedRepo, path);
  };

  // Navigate back in the path history
  const navigateBack = () => {
    if (pathHistory.length <= 1) {
      // Back to root
      fetchRepoContents(selectedRepo);
      setPathHistory([]);
    } else {
      const newHistory = [...pathHistory];
      newHistory.pop(); // Remove current path
      const previousPath = newHistory[newHistory.length - 1] || '';
      fetchRepoContents(selectedRepo, previousPath);
      setPathHistory(newHistory);
    }
  };

  // Get file content and import to editor
  const importFile = async (file) => {
    try {
      setIsLoading(true);
      setError('');
      const headers = token ? { Authorization: `token ${token}` } : {};
      
      const response = await axios.get(file.download_url, { headers });
      
      onFileSelect({
        content: response.data,
        name: file.name,
        path: `${selectedRepo.name}/${currentPath}/${file.name}`.replace(/\/+/g, '/'),
        language: getLanguageFromFilename(file.name)
      });
      
      onClose();
    } catch (err) {
      setError('Error importing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine language based on file extension
  const getLanguageFromFilename = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const extensionMap = {
      'js': 'javascript',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'html': 'html',
      'css': 'css',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'swift': 'swift',
      'kt': 'kotlin',
      'md': 'markdown'
    };
    
    return extensionMap[extension] || 'text';
  };

  // Handle authentication
  const handleTokenSubmit = (e) => {
    e.preventDefault();
    // Token validation will happen in the useEffect
  };

  // Handle search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchRepositories();
    }
  };

  // Render authentication form
  const renderAuthForm = () => (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <FaGithub className="text-3xl mr-2" />
        <h2 className="text-xl font-bold">GitHub Authentication</h2>
      </div>
      <p className="mb-4">Enter your GitHub Personal Access Token to import private repositories.</p>
      <form onSubmit={handleTokenSubmit} className="space-y-4">
        <div>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="GitHub Personal Access Token"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isLoading ? 'Authenticating...' : 'Authenticate'}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-400">
        <p>Don't have a token? <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Create one</a>.</p>
        <p className="mt-2">Or <button onClick={() => setIsAuthenticated(true)} className="text-blue-400 hover:underline">continue without authentication</button> (public repositories only).</p>
      </div>
    </div>
  );

  // Render repository search
  const renderRepoSearch = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaGithub className="text-2xl mr-2" />
          <h2 className="text-xl font-bold">GitHub Repository Import</h2>
        </div>
        {token && (
          <button
            onClick={() => {
              setToken('');
              setIsAuthenticated(false);
              localStorage.removeItem('github_token');
            }}
            className="text-sm text-gray-400 hover:text-gray-300"
          >
            Logout
          </button>
        )}
      </div>
      
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search for repositories..."
          className="w-full p-2 pl-10 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 text-white"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <button
          onClick={searchRepositories}
          disabled={isLoading || !searchQuery}
          className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          Search
        </button>
      </div>
      
      {isLoading && <div className="text-center py-4">Loading...</div>}
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="flex-grow overflow-y-auto">
        {repositories.length > 0 ? (
          <ul className="space-y-2">
            {repositories.map(repo => (
              <li
                key={repo.id}
                onClick={() => handleRepoSelect(repo)}
                className="p-3 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
              >
                <div className="font-medium">{repo.name}</div>
                {repo.description && <div className="text-sm text-gray-400 mt-1">{repo.description}</div>}
                <div className="text-xs text-gray-500 mt-1">⭐ {repo.stars}</div>
              </li>
            ))}
          </ul>
        ) : (
          searchQuery && !isLoading && <div className="text-center py-4 text-gray-400">No repositories found</div>
        )}
      </div>
    </div>
  );

  // Render repository contents
  const renderRepoContents = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={() => setSelectedRepo(null)} className="text-blue-400 hover:text-blue-300 mr-2">
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-bold truncate">{selectedRepo.name}</h2>
      </div>
      
      <div className="bg-gray-800 p-2 rounded mb-4 flex items-center overflow-x-auto">
        <button onClick={navigateBack} disabled={!currentPath} className={`mr-2 ${!currentPath ? 'text-gray-600' : 'text-blue-400 hover:text-blue-300'}`}>
          <FaChevronLeft />
        </button>
        <span className="text-gray-400">/{currentPath}</span>
      </div>
      
      {isLoading && <div className="text-center py-4">Loading...</div>}
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="flex-grow overflow-y-auto">
        {repoContents.length > 0 ? (
          <ul className="space-y-1">
            {/* Show folders first, then files */}
            {repoContents
              .sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
              })
              .map(item => (
                <li
                  key={item.sha}
                  onClick={() => item.type === 'dir' ? navigateToFolder(`${currentPath}/${item.name}`.replace(/^\//, '')) : importFile(item)}
                  className="p-2 rounded hover:bg-gray-700 cursor-pointer flex items-center"
                >
                  {item.type === 'dir' ? (
                    <FaFolder className="text-yellow-400 mr-2" />
                  ) : (
                    <FaFile className="text-gray-400 mr-2" />
                  )}
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>
        ) : (
          !isLoading && <div className="text-center py-4 text-gray-400">Empty repository</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md h-96 text-white">
        {!isAuthenticated ? (
          renderAuthForm()
        ) : selectedRepo ? (
          renderRepoContents()
        ) : (
          renderRepoSearch()
        )}
        
        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubImporter;