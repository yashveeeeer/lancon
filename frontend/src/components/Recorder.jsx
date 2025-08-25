// src/components/Recorder.jsx
import React, { useEffect, useRef, useState } from 'react';
import { RecorderModel } from '../models/recorderModel';
import { useNavigate } from 'react-router-dom';


const Recorder = () => {
  const navigate = useNavigate();
  const modelRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState(null)

  useEffect(() => {
    modelRef.current = new RecorderModel();
    
    modelRef.current.onDataAvailable((data) => {
      try {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      setData(parsedData);
    } catch (err) {
      console.error("Error parsing backend data:", err);
  }
    });
  }, []);

  const handleStart = async () => {
    const success = await modelRef.current.init();
    if (success) {
      modelRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStop = () => {
    modelRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="recorder">
      <h2>Audio Recorder</h2>
      <button onClick={handleStart} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={handleStop} disabled={!isRecording}>
        Stop Recording
      </button>
      {data && (
        <div>
          <br />
          <div className="english-text">{data?.english_text}</div>
          <h1 className="japanese-text">{data?.japanese_text}</h1>
          {data?.japanese_audio && (
            <audio controls>
             <source
                src={`data:audio/mp3;base64,${data.japanese_audio}`}
                type="audio/mp3"
             />
                Your browser does not support the audio tag.
           </audio>
          )}

        </div>
        
      )}
      <button onClick={()=>navigate('/ws/chat')}>for chat</button>
    </div>
  );
};

export default Recorder;
