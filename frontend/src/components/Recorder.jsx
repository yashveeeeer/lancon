import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RecorderModel } from '../models/recorderModel';
import { useNavigate } from 'react-router-dom';

// Translations are unchanged
const translations = {
  en: {
    appTitle: "LANCON Voice",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark",
    pageTitle: "Voice Translator",
    subtitle: "Press the microphone, speak in English, and get the instant Japanese translation.",
    recordingInProgress: "Recording...",
    readyToRecord: "Tap to Speak",
    processingTitle: "Translating Your Voice...",
    processingSubtitle: "Our AI is working its magic. This should only take a moment.",
    englishLabel: "Your English",
    japaneseLabel: "Japanese Translation",
    audioLabel: "Audio",
    translationResult: "Translation Result",
    continueToChat: "Continue to Text Chat",
    audioNotSupported: "Your browser does not support the audio tag.",
    invalidDataReceived: "[Invalid data received]",
    errorParsingResponse: "[Error parsing response]",
    playAudio: "Play Audio",
    pauseAudio: "Pause Audio",
    audioError: "Audio playback error",
    signout:"Sign Out",
    footerText: "© 2025 LANCON. All Rights Reserved."
  },
  ja: {
    appTitle: "LANCON Voice",
    lightMode: "☀️ ライト",
    darkMode: "🌙 ダーク",
    pageTitle: "音声翻訳",
    subtitle: "マイクを押して英語で話すと、即座に日本語の翻訳が表示されます。",
    recordingInProgress: "録音中...",
    readyToRecord: "タップして話す",
    processingTitle: "音声を翻訳中...",
    processingSubtitle: "AIが翻訳作業中です。しばらくお待ちください。",
    englishLabel: "あなたの英語",
    japaneseLabel: "日本語翻訳",
    audioLabel: "音声",
    translationResult: "翻訳結果",
    continueToChat: "テキストチャットに進む",
    audioNotSupported: "お使いのブラウザは音声タグをサポートしていません。",
    invalidDataReceived: "[無効なデータを受信しました]",
    errorParsingResponse: "[レスポンス解析エラー]",
    playAudio: "音声再生",
    pauseAudio: "音声停止",
    audioError: "音声再生エラー",
    signout:"ログアウト",
    footerText: "© 2025 LANCON. 無断複写・転載を禁じます。",
    haha:""
  }
};

// --- YOUR ORIGINAL CustomAudioPlayer COMPONENT (UNCHANGED) ---
const CustomAudioPlayer = ({ src, darkMode, t }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadedMetadata = () => { setDuration(audio.duration); setIsLoading(false); };
    const handleTimeUpdate = () => { setCurrentTime(audio.currentTime); };
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };
    const handleError = () => { setHasError(true); setIsLoading(false); };
    const handleCanPlay = () => { setIsLoading(false); setHasError(false); };
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [src]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    try {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { await audio.play(); setIsPlaying(true); }
    } catch (error) { console.error('Audio playback error:', error); setHasError(true); }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) { audioRef.current.volume = newVolume; }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (hasError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
        <p className="text-red-600 dark:text-red-400 text-sm">{t("audioError")}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center space-x-4">
        <button onClick={togglePlayPause} disabled={isLoading} className={`relative w-12 h-12 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500/50 shadow-lg'}`}>
          {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : <span className="text-lg">{isPlaying ? '⏸️' : '▶️'}</span>}
        </button>
        <div className="flex-1 space-y-2">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer overflow-hidden" onClick={handleProgressChange}>
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">🔊</span>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, rgb(139, 92, 246) 0%, rgb(139, 92, 246) ${volume * 100}%, rgb(209, 213, 219) ${volume * 100}%, rgb(209, 213, 219) 100%)` }} />
        </div>
      </div>
      <style jsx>{` .slider::-webkit-slider-thumb { appearance: none; height: 12px; width: 12px; border-radius: 50%; background: rgb(139, 92, 246); cursor: pointer; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); } `}</style>
    </div>
  );
};


const Recorder = () => {
  // --- YOUR ORIGINAL CORE LOGIC (with new isProcessing state) ---
  const navigate = useNavigate();
  const modelRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState(null);
  const [audioKey, setAudioKey] = useState(0);
  const [audioLevels, setAudioLevels] = useState(Array(36).fill(0));
  const [currentLang, setCurrentLang] = useState('en');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lancon-theme');
    return saved ? JSON.parse(saved) : false;
  });

  const changeLanguage = (lang) => { setCurrentLang(lang); localStorage.setItem('lancon-language', lang); };
  const toggleTheme = () => { setDarkMode(prev => { const val = !prev; localStorage.setItem('lancon-theme', JSON.stringify(val)); return val; }); };
  useEffect(() => { const lang = localStorage.getItem('lancon-language'); if (lang && translations[lang]) { setCurrentLang(lang); } }, []);
  const t = useCallback((key) => translations[currentLang][key] || key, [currentLang]);

  const extractTextFromResponse = (textData) => {
    if (!textData) return ""; if (typeof textData === "string" && !textData.includes("'text':") && !textData.includes('"text"')) return textData;
    if (typeof textData === "object" && textData.text) return textData.text; if (typeof textData === "string") {
      try { const d = JSON.parse(textData.replace(/'/g, '"')); if (d.text) return d.text; if (!textData.includes('{')) return textData; }
      catch (e) { const m = textData.match(/"text":\s*"([^"]+)"/) || textData.match(/'text':\s*'([^']+)'/); if (m && m[1]) return m[1]; if (!textData.includes('{')) return textData; }
    } return t("invalidDataReceived");
  };

  useEffect(() => {
    let animationFrame;
    if (isRecording) { const animate = () => { setAudioLevels(p => p.map(() => Math.random())); animationFrame = requestAnimationFrame(animate); }; animate(); }
    return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
  }, [isRecording]);

  useEffect(() => {
    modelRef.current = new RecorderModel();
    modelRef.current.onDataAvailable((data) => {
      try {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        if (parsed && typeof parsed === "object" && ("english_text" in parsed || "japanese_text" in parsed)) {
          setData({ english_text: extractTextFromResponse(parsed.english_text), japanese_text: extractTextFromResponse(parsed.japanese_text), japanese_audio: parsed.japanese_audio });
        } else { setData({ english_text: t("invalidDataReceived"), japanese_text: "", japanese_audio: "" }); }
        setAudioKey(prev => prev + 1);
      } catch (err) { setData({ english_text: t("errorParsingResponse"), japanese_text: "", japanese_audio: "" }); }
      finally { setIsProcessing(false); }
    });
  }, [t]);

  const handleStart = async () => {
    const success = await modelRef.current.init();
    if (success) { setData(null); modelRef.current.start(); setIsRecording(true); }
  };

  const handleStop = () => {
    modelRef.current.stop();
    setIsRecording(false);
    setIsProcessing(true);
  };

  const audioSrc = data?.japanese_audio ? `data:audio/mp3;base64,${data.japanese_audio}` : null;
  const handleSignOut = () => { localStorage.clear(); navigate("/login"); };
  // --- END OF CORE LOGIC ---

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md backdrop-blur-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold text-white tracking-wide" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>{t("appTitle")}</h1>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => changeLanguage("en")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'en' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>English</button>
                        <button onClick={() => changeLanguage("ja")} className={`px-3 py-1 text-xs border rounded transition-colors ${currentLang === 'ja' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>日本語</button>
                    </div>
                    <button className="text-sm bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30" onClick={toggleTheme}>{darkMode ? t("lightMode") : t("darkMode")}</button>
                    <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition">{t("signout")}</button>
                </div>
            </div>
        </header>

        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="flex flex-col items-center text-center space-y-12">

                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{t("pageTitle")}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">{t("subtitle")}</p>
                </div>
<div className='max-w-3xl mx-auto text-center space-y-4 mt-6'>
  <div className="px-6 py-5 rounded-xl font-medium border backdrop-blur-sm bg-gradient-to-br from-red-50 to-rose-50 text-red-800 border-red-300 shadow-lg shadow-red-100/50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 dark:text-red-200 dark:border-red-800/50 dark:shadow-red-900/20">
    <div className="flex items-start gap-3">
      <span className="text-xl mt-0.5">⚠️</span>
      <div className="flex-1 text-left">
        <p className="leading-relaxed">
          Due to the high GPU cost of running Whisper models, this feature isn't live on the hosted version. You can still try it locally by forking the project and running it on your own machine.
        </p>
        <a 
          href="https://github.com/yashveeeeer/lancon" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  </div>
  
  <div className="px-6 py-5 rounded-xl font-medium border backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-800 border-indigo-300 shadow-lg shadow-indigo-100/50 dark:bg-gradient-to-br dark:from-indigo-950/40 dark:to-purple-950/30 dark:text-indigo-200 dark:border-indigo-800/50 dark:shadow-indigo-900/20">
    <div className="flex items-center justify-center gap-2">
      <span>Meanwhile, you can continue using the multilingual chat app below</span>
    </div>
  </div>
</div>

               {/*<div className="relative flex items-center justify-center w-64 h-64">
                    <div className="absolute w-full h-full flex items-center justify-center">
                        {audioLevels.map((level, i) => (
                            <div key={i} className="absolute left-1/2 top-0 w-1 h-1/2 origin-bottom" style={{ transform: `rotate(${i * 10}deg)` }}>
                                <div className={`w-full bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full transition-all duration-100 ${isRecording ? 'opacity-100' : 'opacity-20'}`} style={{ height: `${isRecording ? 10 + level * 50 : 10}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <button onClick={isRecording ? handleStop : handleStart} disabled={isProcessing} className={`relative w-32 h-32 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-8 ${isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500/30 shadow-2xl shadow-red-500/50' : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500/30 shadow-2xl shadow-indigo-500/50'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className="text-5xl">{isRecording ? '■' : '🎤'}</span>
                    </button>
                </div>
                 <p className={`text-lg font-medium transition-colors ${isRecording ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-gray-600 dark:text-gray-400'}`}>
                    {isRecording ? t("recordingInProgress") : t("readyToRecord")}
                </p>

                {isProcessing && (
                  <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 space-y-4 animate-fade-in text-center">
                      <h3 className="text-2xl font-bold">{t("processingTitle")}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{t("processingSubtitle")}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden mt-4">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full animate-shimmer"></div>
                      </div>
                  </div>
                )}

                {data && !isProcessing && (
                    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in">
                        <h3 className="text-2xl font-bold text-center">{t("translationResult")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2"><span className="text-2xl">🇺🇸</span><h4 className="font-semibold text-lg">{t("englishLabel")}</h4></div>
                                <p className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg h-full min-h-[60px]">{data.english_text}</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2"><span className="text-2xl">🇯🇵</span><h4 className="font-semibold text-lg">{t("japaneseLabel")}</h4></div>
                                <p className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg h-full min-h-[60px] text-xl">{data.japanese_text}</p>
                            </div>
                        </div>
                        {audioSrc && (
                            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-2"><span className="text-2xl">🔊</span><h4 className="font-semibold text-lg">{t("audioLabel")}</h4></div>
                                <CustomAudioPlayer key={audioKey} src={audioSrc} darkMode={darkMode} t={t} />
                            </div>
                        )}
                    </div>
                )}*/}

                

                <div className="pt-4">
                    {/* THIS IS THE CORRECTED LINE */}
                    <button onClick={() => navigate('/ws/chat')} className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg transition-transform transform hover:scale-105">
                        <span>{t("continueToChat")}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
            </div>
        </main>

        <footer className="bg-gray-200 dark:bg-gray-800 py-6 mt-12">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-400"><p>{t("footerText")}</p></div>
        </footer>

        <style jsx>{`
          .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
          @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
            background-size: 200% 100%;
            background-image: linear-gradient(to right, #4f46e5 0%, #a855f7 50%, #4f46e5 100%);
          }
          @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    </div>
  );
};

export default Recorder;