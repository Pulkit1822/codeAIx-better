import React, { useState, useRef, useEffect } from 'react';
import { 
  FaShareAlt, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLinkedin,
  FaFacebook,
  FaCopy,
  FaShareSquare,
  FaTimes  // Import FaTimes for X logo
} from 'react-icons/fa';

const ShareCodeButton = ({ code, language }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle sharing for different platforms
  const handleShare = (platform) => {
    const textToShare = code || '';
    const encodedText = encodeURIComponent(textToShare);
    const subject = encodeURIComponent(`Check out this ${language.toUpperCase()} code`);
    
    let url = '';

    switch (platform) {
      case 'twitter':
        url = `https://x.com/intent/tweet?text=${subject}&url=${encodedText}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${subject}: ${encodedText}`;
        break;
      case 'email':
        url = `mailto:?subject=${subject}&body=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${subject}&summary=${encodedText}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedText}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(textToShare);
        alert('Code copied to clipboard!');
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: `${language.toUpperCase()} Code Snippet`,
            text: textToShare,
          }).catch((error) => console.log('Error sharing:', error));
        }
        break;
      default:
        console.error(`Unsupported sharing platform: ${platform}`);
        break;
    }

    if (url && platform !== 'copy' && platform !== 'native') {
      window.open(url, '_blank');
    }
    
    setShowDropdown(false);
  };

  return (
    <div className="share-code-container">
      <button 
        className="code-action-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Share code"
      >
        <FaShareSquare style={{ fontSize: '18px' }} />
      </button>
      
      {showDropdown && (
        <div className="share-dropdown" ref={dropdownRef}>
          <button 
            onClick={() => handleShare('twitter')}
            className="share-icon-button x-icon"
            aria-label="Share on X"
          >
            <span className="tooltip">X</span>
            <FaTimes style={{ fontWeight: 'bold', transform: 'scale(1.2)' }} />
          </button>
          <button 
            onClick={() => handleShare('whatsapp')}
            className="share-icon-button whatsapp-icon"
            aria-label="Share on WhatsApp"
          >
            <span className="tooltip">WhatsApp</span>
            <FaWhatsapp />
          </button>
          <button 
            onClick={() => handleShare('email')}
            className="share-icon-button email-icon"
            aria-label="Share via Email"
          >
            <span className="tooltip">Email</span>
            <FaEnvelope />
          </button>
          <button 
            onClick={() => handleShare('linkedin')}
            className="share-icon-button linkedin-icon"
            aria-label="Share on LinkedIn"
          >
            <span className="tooltip">LinkedIn</span>
            <FaLinkedin />
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            className="share-icon-button facebook-icon"
            aria-label="Share on Facebook"
          >
            <span className="tooltip">Facebook</span>
            <FaFacebook />
          </button>
          <button 
            onClick={() => handleShare('copy')}
            className="share-icon-button copy-icon"
            aria-label="Copy Code"
          >
            <span className="tooltip">Copy</span>
            <FaCopy />
          </button>
          {navigator.share && (
            <button 
              onClick={() => handleShare('native')}
              className="share-icon-button native-icon"
              aria-label="Native Share"
            >
              <span className="tooltip">Native Share</span>
              <FaShareAlt />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareCodeButton;