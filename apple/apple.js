document.addEventListener('DOMContentLoaded', (e) => {
  const canvas = document.getElementById('canv');
  const ctx = canvas.getContext('2d');
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const fftSize = 128;

  const audioContext = new AudioContext();
  const audioElement = document.querySelector('audio');
  const source = audioContext.createMediaElementSource(audioElement);
  const audioAnalyser = audioContext.createAnalyser();
  audioAnalyser.fftSize = fftSize;
  let dataArray = new Uint8Array(audioAnalyser.frequencyBinCount);
  const w = width / dataArray.length;

  let raf;

  source.connect(audioAnalyser).connect(audioContext.destination);

  function draw() {
    audioAnalyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < dataArray.length; i++) {
      let value = dataArray[i] / 256;
      let y = height - height * value - 1;

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0 / 6, 'red');
      gradient.addColorStop(1 / 6, 'orange');
      gradient.addColorStop(2 / 6, 'yellow');
      gradient.addColorStop(3 / 6, 'green');
      gradient.addColorStop(4 / 6, 'blue');
      gradient.addColorStop(5 / 6, 'indigo');
      gradient.addColorStop(6 / 6, 'violet');

      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#fff';
      ctx.fillRect(i * w, height, w - 4, -y);
    }

    raf = requestAnimationFrame(draw);
  }

  audioElement.onplay = function () {
    raf = requestAnimationFrame(draw);
  };

  audioElement.onpause = function () {
    cancelAnimationFrame(raf);
  };
});
