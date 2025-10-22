// src/models/recorderModel.js
export class RecorderModel {
  constructor() {
    this.recorder = null;
    this.chunks = [];
    this.audioCallback = () => {};
    this.stream = null;
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('audio/webm;codecs=opus not supported, trying audio/ogg;codecs=opus');
        options.mimeType = 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error('No supported codec found, falling back to default');
          this.recorder = new MediaRecorder(this.stream);
        } else {
          this.recorder = new MediaRecorder(this.stream, options);
        }
      } else {
        this.recorder = new MediaRecorder(this.stream, options);
      }

      this.recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        } else {
        }
      });

      this.recorder.addEventListener('stop', () => {
        this.stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(this.chunks, { type: this.recorder.mimeType });
        if (blob.size > 0) {
          this.sendAudio(blob);
        } else {
          console.error('No audio data recorded');
          this.audioCallback({
            english_text: '[No audio data recorded]',
            japanese_text: '[録音データがありません]',
            japanese_audio: ''
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Error getting media stream:', error);
      alert('Could not access your microphone. Please check permissions.');
      return false;
    }
  }

  start() {
    if (this.recorder && this.recorder.state === 'inactive') {
      this.chunks = [];
      this.recorder.start(); // Remove chunking to send full recording
    }
  }

  stop() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  onDataAvailable(callback) {
    this.audioCallback = callback;
  }

  sendAudio(blob) {
    const formData = new FormData();
    formData.append('audiofile', blob, 'recording.webm');
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_BASE_URL}/upload-audio`, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      this.audioCallback(data);
    })
    .catch(err => {
      console.error('Error sending audio to backend:', err);
      this.audioCallback({
        english_text: '[Error sending audio]',
        japanese_text: '[音声を送信中にエラーが発生しました]',
        japanese_audio: ''
      });
    });
  }
}