export class RecorderModel {
  constructor() {
    this.recorder = null;
    this.chunks = [];
    this.audioCallback = () => {};
    this.stream = null; // Store the stream here
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new MediaRecorder(this.stream);

      // Use addEventListener for better practice
      // dataavailable works as the confirming agent for addEventListner telling yes there is some data we have so run the 
      // the function we have
      this.recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
      });

      this.recorder.addEventListener('stop', () => {
        // Stop the microphone stream
        this.stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
        this.sendAudio(blob)
        const audioURL = URL.createObjectURL(blob);
        this.audioCallback(audioURL);
      });

      return true; // Return a boolean to indicate success

    } catch (error) {
      console.error('Error getting media stream: ', error);
      alert('Could not access your microphone. Please check permissions.');
      return false;
    }
  }

  start() {
    if (this.recorder && this.recorder.state === 'inactive') {
      this.chunks = []; // Clear chunks for a new recording
      this.recorder.start();
      console.log('Recording started'); // Add a log for debugging
    }
  }

  stop() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
      console.log('Recording stopped'); // Add a log for debugging
    }
  }

  onDataAvailable(callback) {
    this.audioCallback = callback;
  }

  sendAudio(blob){
    const formData = new FormData();
    formData.append('audiofile',blob,'recording.webm')

    fetch("http://localhost:8000/upload-audio",{
      method:'POST',
      body:formData
    })
    .then(res=>res.json())
    .then(data=>{
      this.audioCallback(data)
    })
  }
}