// src/components/Recorder.jsx
import React, { useEffect, useRef, useState } from 'react';
import { RecorderModel } from '../models/recorderModel';

const Recorder = () => {
  const modelRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  useEffect(() => {
    modelRef.current = new RecorderModel();

    modelRef.current.onDataAvailable((url) => {
      setAudioURL(url);
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

      {audioURL && (
        <div>
          <h3>Playback:</h3>
          <audio id="audioPlayback" controls src={audioURL}></audio>
          <br />
          <a id="downloadLink" href={audioURL} download="recording.webm">
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default Recorder;
