import React, { useEffect, useState } from "react";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";

import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import CodeEditorWindow from "./CodeEditorWindow";

const Landing = () => {
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState({
    value: "oceanic-next",
    label: "Oceanic Next",
  });
  const [language, setLanguage] = useState(languageOptions[0]);
  const [fileName, setFileName] = useState("Untitled");

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile();
    }
  });

  const onChange = (action, data) => {
    switch (action) {
      case "code":
        setCode(data);
        break;
      default:
        console.warn("case not handled!", action, data);
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then((response) => {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        const status = err.response ? err.response.status : null;
        if (status === 429) {
          showErrorToast(`Quota of 100 requests exceeded for the Day!`, 10000);
        }
        setProcessing(false);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `${process.env.REACT_APP_RAPID_API_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      const response = await axios.request(options);
      const statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      setProcessing(false);
      showErrorToast();
    }
  };

  const handleThemeChange = (th) => {
    const theme = th;
    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  };

  // Handle imported file from GitHub
  const handleFileImport = (fileData) => {
    setCode(fileData.content);
    setFileName(fileData.name);
    
    // Find and set the language based on the file extension
    const fileLanguage = languageOptions.find(lang => lang.value === fileData.language);
    if (fileLanguage) {
      setLanguage(fileLanguage);
    }
    
    showSuccessToast(`File "${fileData.name}" imported successfully!`);
  };

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
    
    // Expose the handleFileImport function globally for the Navbar component
    window.handleFileImport = handleFileImport;
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-row">
          <div className="px-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
          <div className="px-2">
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          </div>
        </div>
        <div className="text-white opacity-70 text-sm">
          {fileName}
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end relative">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <div className="flex flex-col items-start relative">
            <h1 className="font-bold text-xl text-white-800 mb-1">Input</h1>

            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <h1 className="font-bold text-xl text-white-800 mt-4 mb-2">Output</h1>

            <OutputWindow outputDetails={outputDetails} />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2",
                "border-[#8A8275]",
                "border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200",
                !code ? "opacity-50" : "",
                "bg-[#444444] text-[#FFFFFF] focus:outline-none"
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </>
  );
};

export default Landing;