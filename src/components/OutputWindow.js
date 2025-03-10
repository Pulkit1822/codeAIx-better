import React from "react";
import CopyButton from "./CopyButton";

const OutputWindow = ({ outputDetails }) => {
  // Helper function to safely decode base64 strings with UTF-8 support
  const safeAtob = (encoded) => {
    if (!encoded) return '';
    try {
      // Decode base64 to binary, then handle UTF-8 characters properly
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
      console.error("Base64 decoding failed:", error);
      return "Error decoding output";
    }
  };

  const getOutput = () => {
    if (!outputDetails) return null;

    const statusId = outputDetails?.status?.id;
    
    // Decode outputs only when needed
    let output = '';
    
    switch (statusId) {
      case 6: // Compilation error
        output = safeAtob(outputDetails?.compile_output);
        return {
          text: output,
          type: "error"
        };
      case 3: // Successful output
        output = safeAtob(outputDetails?.stdout);
        return {
          text: output || "Program executed successfully with no output",
          type: "success"
        };
      case 5: // Time Limit Exceeded
        return {
          text: "Time Limit Exceeded",
          type: "error"
        };
      default:
        // Check stderr first, then fallback to other outputs
        if (outputDetails?.stderr) {
          output = safeAtob(outputDetails.stderr);
          return {
            text: output,
            type: "error"
          };
        } else if (outputDetails?.stdout) {
          output = safeAtob(outputDetails.stdout);
          return {
            text: output,
            type: "success"
          };
        } else if (outputDetails?.compile_output) {
          output = safeAtob(outputDetails.compile_output);
          return {
            text: output,
            type: "error"
          };
        } else {
          return {
            text: "No output available",
            type: "info"
          };
        }
    }
  };

  // Get the processed output
  const processedOutput = getOutput();
  
  // Generate copy text content
  const copyText = processedOutput?.text || '';

  return (
    <div className="relative w-full h-56 bg-gray-800 rounded-md text-gray-200 font-normal text-sm overflow-y-auto">
      <CopyButton textToCopy={copyText} />
      {processedOutput && (
        <pre 
          className={`${processedOutput.type}-output`} 
          style={{
            padding: "0.5rem 1rem",
            whiteSpace: "pre-wrap"
          }}
        >
          {processedOutput.text}
        </pre>
      )}
    </div>
  );
};

export default OutputWindow;
