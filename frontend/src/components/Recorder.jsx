// src/components/Recorder.jsx
import React, { useEffect, useRef, useState } from 'react';
import { RecorderModel } from '../models/recorderModel';
import { useNavigate } from 'react-router-dom';

const Recorder = () => {
  const navigate = useNavigate();
  const modelRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState(null);
  const [audioKey, setAudioKey] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(12).fill(0));

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
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        // Ensure it has expected fields
        if (
          parsed && typeof parsed === "object" &&
          ("english_text" in parsed || "japanese_text" in parsed)
        ) {
          setData(parsed);
        } else {
          console.warn("Unexpected response format:", parsed);
          setData({
            english_text: "[Invalid data received]",
            japanese_text: "",
            japanese_audio: ""
          });
        }

        setAudioKey(prev => prev + 1);
      } catch (err) {
        console.error("Error parsing backend data:", err);
        setData({
          english_text: "[Error parsing response]",
          japanese_text: "",
          japanese_audio: ""
        });
      }
    });
  }, []);

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
    ? `data:audio/mp3;base64,${data.japanese_audio}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <span className="text-2xl">🎙️</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            Voice<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time speech translation powered by AI
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Recording interface */}
          <div className="flex flex-col items-center space-y-8">
            {/* Audio visualizer */}
            <div className="flex items-end justify-center space-x-1 h-24">
              {audioLevels.map((level, i) => (
                <div
                  key={i}
                  className={`w-1.5 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full transition-all duration-75 ${
                    isRecording ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    height: isRecording ? `${20 + level * 0.6}px` : '20px',
                    transitionDelay: `${i * 20}ms`
                  }}
                />
              ))}
            </div>

            {/* Record button */}
            <div className="relative">
              {isRecording && (
                <div className="absolute inset-0 animate-ping">
                  <div className="w-full h-full rounded-full bg-red-400 opacity-75"></div>
                </div>
              )}
              <button
                onClick={isRecording ? handleStop : handleStart}
                className={`relative w-24 h-24 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500/50 shadow-lg shadow-red-500/25'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-purple-500/50 shadow-lg shadow-purple-500/25'
                }`}
              >
                <span className="text-2xl">
                  {isRecording ? '⏹️' : '🎤'}
                </span>
              </button>
            </div>

            {/* Status text */}
            <div className="text-center">
              <p className={`text-lg font-medium transition-colors ${
                isRecording ? 'text-red-400' : 'text-slate-400'
              }`}>
                {isRecording ? 'Recording in progress...' : 'Ready to record'}
              </p>
            </div>
          </div>

          {/* Translated Results */}
          {data && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🇺🇸</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">English</h3>
                </div>
                <p className="text-slate-200 text-lg leading-relaxed">
                  {data?.english_text}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🇯🇵</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Japanese</h3>
                </div>
                <p className="text-slate-200 text-2xl font-bold leading-relaxed font-mono">
                  {data?.japanese_text}
                </p>
              </div>

              {audioSrc && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🔊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Audio</h3>
                  </div>
                  <audio 
                    key={audioKey}
                    controls
                    className="w-full h-12 bg-slate-800 rounded-lg"
                  >
                    <source src={audioSrc} type="audio/mp3" />
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => navigate('/ws/chat')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
            >
              <span>💬</span>
              <span>Continue to Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recorder;
