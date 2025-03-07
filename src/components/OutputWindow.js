import React from "react";
import CopyButton from "./CopyButton";

const OutputWindow = ({ outputDetails }) => {
  const renderOutput = () => {
    const statusId = outputDetails?.status?.id;
    const decodedCompileOutput = atob(outputDetails?.compile_output);
    const decodedStdout = atob(outputDetails?.stdout);
    const decodedStderr = atob(outputDetails?.stderr);

    const preStyles = {
      padding: "0.5rem 1rem", // Add padding similar to the custom input window
      whiteSpace: "pre-wrap", // Ensure long lines wrap
    };

    switch (statusId) {
      case 6: // Compilation error
        return <pre className="error-output" style={preStyles}>{decodedCompileOutput}</pre>;
      case 3: // Successful output
        return <pre className="success-output" style={preStyles}>{decodedStdout || null}</pre>;
      case 5: // Time Limit Exceeded
        return <pre className="error-output" style={preStyles}>Time Limit Exceeded</pre>;
      default: // Other cases (e.g., stderr)
        return <pre className="error-output" style={preStyles}>{decodedStderr}</pre>;
    }
  };

  const outputText = outputDetails ? atob(outputDetails.stdout || outputDetails.stderr || outputDetails.compile_output) : '';

  return (
    <div className="relative w-full h-56 bg-gray-800 rounded-md text-gray-200 font-normal text-sm overflow-y-auto">
      <CopyButton textToCopy={outputText} />
      {outputDetails && renderOutput()}
    </div>
  );
};

export default OutputWindow;
