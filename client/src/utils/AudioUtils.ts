import axios from 'axios';

const downloadAudio = (audioBlob: Blob) => {
  const url = window.URL.createObjectURL(audioBlob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.setAttribute('download', 'audio.wav');
  a.click();
  window.URL.revokeObjectURL(url);
};

export default downloadAudio;
