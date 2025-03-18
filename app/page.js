"use client"
import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Copy,
  Download,
  Type,
  AlignJustify,
  Hash,
  FileJson,
  CrownIcon as MarkdownIcon,
  Eraser,
  ArrowRight,
} from "lucide-react";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState(null);


  const [isUppercase, setIsUppercase] = useState(false);
  const [isLowercase, setIsLowercase] = useState(false);
  const [isCapitalize, setIsCapitalize] = useState(false);
  const [isTrim, setIsTrim] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setError(null);
  };

  const convertToUpperCase = () => {
    setIsLowercase(false)
    setIsCapitalize(false)
    setIsUppercase(true)
    trimSpaces()
    setOutputText(inputText.toUpperCase());
  }

  const convertToLowerCase = () => {
    setIsUppercase(false)
    setIsLowercase(true)
    setIsCapitalize(false)
    trimSpaces()
    setOutputText(inputText.toLowerCase());
  }

  const capitalizeText = () => {
    setIsUppercase(false)
    setIsLowercase(false)
    setIsCapitalize(true)
    trimSpaces()

    const capitalizedText = inputText
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    setOutputText(capitalizedText);
  };
  const trimSpaces = () => {
    setIsTrim(true);
  
    let trimText = inputText.replace(/\s+/g, ' ').trim(); 
    setInputText(trimText); 
  
    if (isLowercase) {
      setOutputText(trimText.toLowerCase());
    } else if (isUppercase) {
      setOutputText(trimText.toUpperCase());
    } else if (isCapitalize) {
      const capitalizedText = trimText
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      setOutputText(capitalizedText);
    } else {
      setOutputText(trimText);
    }
  };
  

  const clearText = () => {
    setInputText("");
    setOutputText("");
    setError(null);
  };

  const getWordCount = (text) => {
    let count = 0;
    let inWord = false;

    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") {
        if (!inWord) {
          count++;
          inWord = true;
        }
      } else {
        inWord = false;
      }
    }

    return count;
  };

  const getCharacterCount = (text) => {
    return text.length;
  };

  const convertToJSON = () => {
    try {
      const words = inputText.trim().split(/\s+/);
      const jsonObj = {
        text: inputText,
        words,
        wordCount: words.length,
        characterCount: inputText.length,
      };
      setOutputText(JSON.stringify(jsonObj, null, 2));
      setError(null);
    } catch (error) {
      setError("Error converting to JSON");
      console.error("Error converting to JSON:", error);
    }
  };

  const convertFromJSON = () => {
    try {
      if (!outputText.trim()) {
        setError("Please enter valid JSON");
        return;
      }

      const jsonObj = JSON.parse(outputText);
      if (jsonObj.text) {
        setOutputText(jsonObj.text);
        setError(null);
      } else {
        setError("Invalid JSON: 'text' property not found");
      }
    } catch (error) {
      setError("Invalid JSON format");
      console.error("Error parsing JSON:", error);
    }
  };

  const convertToMarkdown = () => {
    const lines = inputText.split("\n");
    const markdownText = lines
      .map((line) => {
        if (line.trim().startsWith("#")) {
          return line;
        }
        return `> ${line}`;
      })
      .join("\n");
    setOutputText(markdownText);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
    } catch (err) {
      setError("Failed to copy text");
      console.error("Failed to copy text:", err);
    }
  };

  const downloadText = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
        }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1
            className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Text Formatter Tool
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode
              ? "bg-gray-800 text-yellow-400"
              : "bg-gray-200 text-gray-800"
              }`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Input
            </h2>
            <textarea
              value={inputText}
              onChange={handleTextChange}
              placeholder="Enter your text here..."
              className={`w-full h-64 p-4 rounded-lg border ${isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
            <div
              className={`mt-4 grid grid-cols-2 gap-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              <div className="flex items-center gap-2">
                <Hash size={20} />
                <span className="font-semibold">Words:</span>
                <span>{getWordCount(inputText)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={20} />
                <span className="font-semibold">Characters:</span>
                <span>{getCharacterCount(inputText)}</span>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
          >
            <h2
              className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Output
            </h2>
            <textarea
              value={outputText}
              readOnly
              className={`w-full h-64 p-4 rounded-lg border ${isDarkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            />
            <div
              className={`mt-4 grid grid-cols-2 gap-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              <div className="flex items-center gap-2">
                <Hash size={20} />
                <span className="font-semibold">Words:</span>
                <span>{getWordCount(outputText)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash size={20} />
                <span className="font-semibold">Characters:</span>
                <span>{getCharacterCount(outputText)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transformation Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={convertToUpperCase}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Type size={20} /> Uppercase
          </button>
          <button
            onClick={convertToLowerCase}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <Type size={20} /> Lowercase
          </button>
          <button
            onClick={capitalizeText}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          >
            <Type size={20} /> Capitalize
          </button>

          <button
            onClick={trimSpaces}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            <AlignJustify size={20} /> Trim Spaces
          </button>
          <button
            onClick={clearText}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Eraser size={20} /> Clear
          </button>
        </div>

        {/* Format Buttons */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={convertToJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
          >
            <FileJson size={20} /> To JSON
          </button>
          <button
            onClick={convertFromJSON}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <FileJson size={20} /> From JSON
          </button>
          <button
            onClick={convertToMarkdown}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            <MarkdownIcon size={20} /> To Markdown
          </button>
          <button
            onClick={copyToClipboard}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${copySuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
          >
            <Copy size={20} /> {copySuccess ? "Copied!" : "Copy Output"}
          </button>
        </div>

        {/* Download Button */}
        <div className="mt-4">
          <button
            onClick={downloadText}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors w-full"
          >
            <Download size={20} /> Download Output
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
