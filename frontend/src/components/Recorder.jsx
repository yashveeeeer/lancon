// src/components/Recorder.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RecorderModel } from '../models/recorderModel';
import { useNavigate } from 'react-router-dom';

// Translation object for Recorder component
const translations = {
  en: {
    appTitle: "LANCON Voice",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    subtitle: "Real-time speech translation powered by AI from English to Japanese",
    recordingInProgress: "Recording in progress...",
    readyToRecord: "Ready to record",
    englishLabel: "English",
    japaneseLabel: "Japanese",
    audioLabel: "Audio",
    continueToChat: "Continue to Chat",
    audioNotSupported: "Your browser does not support the audio tag.",
    invalidDataReceived: "[Invalid data received]",
    errorParsingResponse: "[Error parsing response]"
  },
  ja: {
    appTitle: "LANCON Voice",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    subtitle: "AIによるリアルタイム音声翻訳",
    recordingInProgress: "録音中...",
    readyToRecord: "録音準備完了",
    englishLabel: "英語",
    japaneseLabel: "日本語", 
    audioLabel: "音声",
    continueToChat: "チャットに進む",
    audioNotSupported: "お使いのブラウザは音声タグをサポートしていません。",
    invalidDataReceived: "[無効なデータを受信しました]",
    errorParsingResponse: "[レスポンス解析エラー]"
  }
};

const Recorder = () => {
  const navigate = useNavigate();
  const modelRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState(null);
  const [audioKey, setAudioKey] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(12).fill(0));
  const [currentLang, setCurrentLang] = useState('en'); // Language state
  const [darkMode, setDarkMode] = useState(false); // theme toggle

  // Translation function - memoized to fix React Hook warning
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  // Language change function
  const changeLanguage = (lang) => {
    setCurrentLang(lang);
  };

  // Helper function to extract text from complex response objects
  const extractTextFromResponse = (textData) => {
    if (!textData) return "";

    // Handle simple string
    if (typeof textData === "string" && !textData.includes("'text':") && !textData.includes('"text"')) {
      return textData;
    }

    // Handle object with text property
    if (typeof textData === "object" && textData.text) {
      return textData.text;
    }

    // Handle stringified JSON
    if (typeof textData === "string") {
      try {
        // Replace single quotes with double quotes for JSON parsing
        const cleanedData = textData.replace(/'/g, '"');
        const parsed = JSON.parse(cleanedData);
        if (parsed.text) {
          return parsed.text;
        }
        // If no text property, return the raw string if it looks like plain text
        if (!textData.includes('{') && !textData.includes('}')) {
          return textData;
        }
      } catch (e) {
        console.warn("Failed to parse textData as JSON:", textData, e);
        // Fallback: Try regex for common patterns
        const match = textData.match(/"text":\s*"([^"]+)"/) || textData.match(/'text':\s*'([^']+)'/);
        if (match && match[1]) {
          return match[1];
        }
        // Return raw string as last resort if it seems like plain text
        if (!textData.includes('{') && !textData.includes('}')) {
          return textData;
        }
      }
    }

    // Fallback for unexpected formats
    console.warn("Unrecognized textData format:", textData);
    return t("invalidDataReceived");
  };

  useEffect(() => {
    let animationFrame;
    if (isRecording) {
      const animate = () => {
        setAudioLevels(prev => prev.map(() => Math.random() * 100));
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isRecording]);

  useEffect(() => {
    modelRef.current = new RecorderModel();

    modelRef.current.onDataAvailable((data) => {
      console.log("Raw data received:", data, typeof data); // Enhanced debug log
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        console.log("Parsed response:", parsed); // Enhanced debug log

        // Ensure it has expected fields
        if (
          parsed && typeof parsed === "object" &&
          ("english_text" in parsed || "japanese_text" in parsed)
        ) {
          // Extract clean text from potentially complex response objects
          const cleanEnglishText = extractTextFromResponse(parsed.english_text);
          const cleanJapaneseText = extractTextFromResponse(parsed.japanese_text);

          console.log("Extracted texts:", { cleanEnglishText, cleanJapaneseText }); // Debug log

          setData({
            english_text: cleanEnglishText,
            japanese_text: cleanJapaneseText,
            japanese_audio: parsed.japanese_audio
          });
        } else {
          console.warn("Unexpected response format:", parsed);
          setData({
            english_text: t("invalidDataReceived"),
            japanese_text: "",
            japanese_audio: ""
          });
        }

        setAudioKey(prev => prev + 1);
      } catch (err) {
        console.error("Parsing error:", err, "Raw data:", data); // Enhanced error log
        setData({
          english_text: t("errorParsingResponse"),
          japanese_text: "",
          japanese_audio: ""
        });
      }
    });
  }, [t]); // Fixed: Added 't' to dependency array

  const handleStart = async () => {
    const success = await modelRef.current.init();
    if (success) {
      setData(null);
      modelRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStop = () => {
    modelRef.current.stop();
    setIsRecording(false);
  };

  const audioSrc = data?.japanese_audio
    ? (() => {
        try {
          // Validate base64 string
          if (!/^[A-Za-z0-9+/=]+$/.test(data.japanese_audio)) {
            console.warn("Invalid base64 audio data:", data.japanese_audio);
            return null;
          }
          return `data:audio/mp3;base64,${data.japanese_audio}`;
        } catch (e) {
          console.error("Error processing audio data:", e);
          return null;
        }
      })()
    : null;

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden text-gray-900 dark:text-gray-100 transition-colors">
          
          {/* Header */}
          <div className="flex justify-between items-center bg-indigo-600 dark:bg-indigo-700 px-6 py-4">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {t("appTitle")}
            </h1>
            <div className="flex gap-2">
              <button
                className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? t("lightMode") : t("darkMode")}
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700">
            <button 
              onClick={() => changeLanguage("en")} 
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                currentLang === 'en' 
                  ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600' 
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
              }`}
            >
              English
            </button>  
            <button 
              onClick={() => changeLanguage("ja")} 
              className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                currentLang === 'ja' 
                  ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600' 
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500'
              }`}
            >
              日本語
            </button>   
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            
            {/* Subtitle */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-base">
                {t("subtitle")}
              </p>
            </div>

            {/* Recording Interface */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-colors">
              
              {/* Audio Visualizer */}
              <div className="flex items-end justify-center space-x-1 h-20 mb-6">
                {audioLevels.map((level, i) => (
                  <div
                    key={i}
                    className={`w-2 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full transition-all duration-75 ${
                      isRecording ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{
                      height: isRecording ? `${20 + level * 0.5}px` : '20px',
                      transitionDelay: `${i * 20}ms`
                    }}
                  />
                ))}
              </div>

              {/* Record Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {isRecording && (
                    <div className="absolute inset-0 animate-ping">
                      <div className="w-full h-full rounded-full bg-red-400 opacity-75"></div>
                    </div>
                  )}
                  <button
                    onClick={isRecording ? handleStop : handleStart}
                    className={`relative w-20 h-20 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500/50 shadow-lg'
                        : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500/50 shadow-lg'
                    }`}
                  >
                    <span className="text-2xl">
                      {isRecording ? '⏹️' : '🎤'}
                    </span>
                  </button>
                </div>

                {/* Status Text */}
                <p className={`text-sm font-medium transition-colors ${
                  isRecording ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {isRecording ? t("recordingInProgress") : t("readyToRecord")}
                </p>
              </div>
            </div>

            {/* Results */}
            {data && (
              <div className="space-y-4">
                
                {/* English Result */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-l-4 border-blue-500 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🇺🇸</span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("englishLabel")}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data?.english_text}
                  </p>
                </div>

                {/* Japanese Result */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-l-4 border-pink-500 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">🇯🇵</span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("japaneseLabel")}</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg font-medium leading-relaxed">
                    {data?.japanese_text}
                  </p>
                </div>

                {/* Audio Result */}
                {audioSrc && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-l-4 border-purple-500 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🔊</span>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t("audioLabel")}</h3>
                    </div>
                    <audio 
                      key={audioKey}
                      controls
                      className="w-full h-10 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <source src={audioSrc} type="audio/mp3" />
                      <source src={audioSrc} type="audio/mpeg" />
                      {t("audioNotSupported")}
                    </audio>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => navigate('/ws/chat')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <span>💬</span>
                <span>{t("continueToChat")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recorder;