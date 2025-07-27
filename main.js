import { RecorderModel } from './recorderModel.js';
import { RecorderView } from './recorderView.js';

const model = new RecorderModel();
const view = new RecorderView();

view.onStart(async () => {
  const stream = await model.init();
  model.start();
  view.toggleRecording(true);
});

view.onStop(() => {
  model.stop();
  view.toggleRecording(false);
});

model.onDataAvailable((audioURL) => {
  view.setAudioSource(audioURL);
});
