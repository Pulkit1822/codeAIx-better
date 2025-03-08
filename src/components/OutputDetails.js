import React, { useEffect, useState } from "react";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle, 
  FaClock, 
  FaMemory, 
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";

const OutputDetails = ({ outputDetails }) => {
  // Animation states for entrance and counters
  const [isVisible, setIsVisible] = useState(false);
  const [animatedMemory, setAnimatedMemory] = useState(0);
  const [animatedTime, setAnimatedTime] = useState(0);
  
  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Reset values on new output details
    setAnimatedMemory(0);
    setAnimatedTime(0);
    
    // Animate counters
    if (outputDetails?.memory) {
      const memoryTarget = outputDetails.memory;
      const memoryDuration = 1000; // 1 second animation
      const memoryStartTime = Date.now();
      
      const animateMemory = () => {
        const now = Date.now();
        const elapsed = now - memoryStartTime;
        const progress = Math.min(elapsed / memoryDuration, 1);
        
        setAnimatedMemory(Math.floor(progress * memoryTarget));
        
        if (progress < 1) {
          requestAnimationFrame(animateMemory);
        } else {
          setAnimatedMemory(memoryTarget);
        }
      };
      
      requestAnimationFrame(animateMemory);
    }
    
    if (outputDetails?.time) {
      const timeTarget = outputDetails.time;
      const timeDuration = 1000; // 1 second animation
      const timeStartTime = Date.now();
      
      const animateTime = () => {
        const now = Date.now();
        const elapsed = now - timeStartTime;
        const progress = Math.min(elapsed / timeDuration, 1);
        
        setAnimatedTime(Math.floor(progress * timeTarget));
        
        if (progress < 1) {
          requestAnimationFrame(animateTime);
        } else {
          setAnimatedTime(timeTarget);
        }
      };
      
      requestAnimationFrame(animateTime);
    }
  }, [outputDetails]);
  
  if (!outputDetails) return null;
  
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 3: // Accepted
        return {
          bg: "rgba(39, 174, 96, 0.15)",
          border: "#27ae60",
          icon: <FaCheckCircle size={16} color="#27ae60" />
        };
      case 4: // Wrong Answer
      case 5: // Time Limit Exceeded
        return {
          bg: "rgba(241, 196, 15, 0.15)",
          border: "#f1c40f",
          icon: <FaExclamationTriangle size={16} color="#f1c40f" />
        };
      case 6: // Compilation Error
      case 7: // Runtime Error (SIGSEGV)
      case 8: // Runtime Error (SIGXFSZ)
      case 9: // Runtime Error (SIGFPE)
      case 10: // Runtime Error (SIGABRT)
      case 11: // Runtime Error (NZEC)
      case 12: // Runtime Error (Other)
      case 13: // Internal Error
      case 14: // Exec Format Error
        return {
          bg: "rgba(231, 76, 60, 0.15)",
          border: "#e74c3c",
          icon: <FaTimesCircle size={16} color="#e74c3c" />
        };
      case 1: // In Queue
      case 2: // Processing
        return {
          bg: "rgba(52, 152, 219, 0.15)",
          border: "#3498db",
          icon: <FaSpinner size={16} color="#3498db" className="spin-animation" />
        };
      default:
        return {
          bg: "rgba(52, 152, 219, 0.15)",
          border: "#3498db",
          icon: <FaInfoCircle size={16} color="#3498db" />
        };
    }
  };

  const formatMemory = (memory) => {
    if (!memory && memory !== 0) return "N/A";
    if (memory < 1000) return `${memory}KB`;
    return `${(memory / 1024).toFixed(1)}MB`;
  };

  const formatTime = (time) => {
    if (!time && time !== 0) return "N/A";
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const truncateStatus = (status) => {
    if (!status) return "Unknown";
    
    // Specific replacements for common long status messages
    if (status.includes("Runtime Error")) {
      return status.replace("Runtime Error", "RT Error");
    }
    if (status.includes("Time Limit Exceeded")) {
      return "Time Limit";
    }
    if (status.includes("Compilation Error")) {
      return "Compile Error";
    }
    if (status === "Internal Error") {
      return "Internal Err";
    }
    if (status === "Exec Format Error") {
      return "Format Error";
    }
    
    // General truncation if still too long
    if (status.length > 15) {
      return status.substring(0, 12) + "...";
    }
    
    return status;
  };

  const statusStyles = getStatusColor(outputDetails?.status?.id);

  return (
    <div 
      className={`output-details-container ${isVisible ? 'visible' : ''}`}
    >
      <div className="details-header">
        <h3 className="details-title">Execution Stats</h3>
      </div>
      
      <div className="metrics-grid">
        {/* Status Metric */}
        <div 
          className="metric-card status-card"
          style={{ 
            backgroundColor: statusStyles.bg,
            borderLeft: `3px solid ${statusStyles.border}`
          }}
        >
          <div className="metric-icon">
            {statusStyles.icon}
          </div>
          <div className="metric-content">
            <p className="metric-label">Status</p>
            <p className="metric-value">
              {truncateStatus(outputDetails?.status?.description)}
            </p>
          </div>
        </div>

        {/* Memory Metric */}
        <div className="metric-card">
          <div className="metric-icon memory-icon">
            <FaMemory size={16} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Memory</p>
            <p className="metric-value counter-value">
              {formatMemory(animatedMemory)}
            </p>
          </div>
        </div>

        {/* Time Metric */}
        <div className="metric-card">
          <div className="metric-icon time-icon">
            <FaClock size={16} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Time</p>
            <p className="metric-value counter-value">
              {formatTime(animatedTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputDetails;
