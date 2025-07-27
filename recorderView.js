export class RecorderView {
  constructor() {
    this.startBtn = document.getElementById('startBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.audio = document.getElementById('audioPlayback');
    this.downloadLink = document.getElementById('downloadLink');

    this.startCallback = () => {};
    this.stopCallback = () => {};

    this.startBtn.addEventListener('click', () => this.startCallback());
    this.stopBtn.addEventListener('click', () => this.stopCallback());
  }

  onStart(callback) {
    this.startCallback = callback;
  }

  onStop(callback) {
    this.stopCallback = callback;
  }

  toggleRecording(isRecording) {
    this.startBtn.disabled = isRecording;
    this.stopBtn.disabled = !isRecording;
  }

  setAudioSource(url) {
    this.audio.src = url;
    this.downloadLink.href = url;
    this.downloadLink.style.display = 'inline';
  }
}
