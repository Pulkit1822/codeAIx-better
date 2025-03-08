import axios from 'axios';

// Function to fetch file content from GitHub
const fetchGitHubFile = async (owner, repo, path, token = '') => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    // Fetch file content from GitHub API
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    if (response.data.type !== 'file') {
      throw new Error('The path does not point to a file');
    }

    // GitHub API returns content as base64
    const content = atob(response.data.content.replace(/\n/g, ''));
    return {
      name: response.data.name,
      path: response.data.path,
      content: content,
      language: response.data.name.split('.').pop() // Get file extension as language
    };
  } catch (error) {
    console.error('Error fetching GitHub file:', error);
    throw error;
  }
};

// Function to fetch repository contents
const fetchGitHubRepo = async (owner, repo, path = '', token = '') => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    // Fetch repository contents
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub repository:', error);
    throw error;
  }
};

export { fetchGitHubRepo, fetchGitHubFile };