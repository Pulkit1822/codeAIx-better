import React from 'react';

const CopyButton = ({ textToCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded hover:bg-gray-600"
      title="Copy to clipboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8v-3h11v3z" />
      </svg>
    </button>
  );
};

export default CopyButton;