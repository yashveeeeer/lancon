export class RecorderModel {
  constructor() {
    this.recorder = null;
    this.chunks = [];
    this.audioCallback = () => {};
  }

  async init() {
    this.chunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(stream);

    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(blob);
      this.audioCallback(audioURL);
    };

    return stream;
  }

  start() {
    this.recorder?.start();
  }

  stop() {
    this.recorder?.stop();
  }

  onDataAvailable(callback) {
    this.audioCallback = callback;
  }
}
