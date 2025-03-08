import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const HEIGHT = "85vh";
const WIDTH = "100%";

const editorClasses = "code-editor-overlay rounded-md overflow-hidden w-full h-full shadow-4xl";

const CodeEditorWindow = ({ onChange, language = "c", code = "", theme = "light" }) => {
  const [value, setValue] = useState(code);

  // This effect updates the editor content when the code prop changes
  useEffect(() => {
    setValue(code);
  }, [code]);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    onChange("code", newValue);
  };

  return (
    <div className={editorClasses}>
      <Editor
        height={HEIGHT}
        width={WIDTH}
        language={language}
        value={value}
        theme={theme}
        defaultValue="// Start typing your C code..."
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorWindow;
