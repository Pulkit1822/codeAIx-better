import React, { useState } from "react";
import "./global.css";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";

function App() {
  const [importedFile, setImportedFile] = useState(null);
  
  const handleFileImport = (fileData) => {
    setImportedFile(fileData);
    // Access the Landing component's import handler via the window object
    if (window.handleFileImport) {
      window.handleFileImport(fileData);
    }
  };

  return (
    <>
      <Navbar onFileImport={handleFileImport} />
      <Landing />
    </>
  );
}

export default App;