document.addEventListener('DOMContentLoaded', (e) => {
  const path = 'music.mp3';

  let audioCtx;
  let sourceNode;
  let analyser;
  let jsNode;
  let ampArray;
  let isPlaying = false;
  let audioData = null;

  const sampleSize = 256;
  const fftSize = 64;
  const canvas = document.getElementById('stage');
  const ctx = canvas.getContext('2d');
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const w = width / fftSize;

  document.getElementById('start_btn').addEventListener('click', (e) => {
    if (!audioCtx) {
      try {
        audioCtx = new AudioContext();
      } catch (e) {
        alert('Web Audio API unavailable');
      }
    }

    e.preventDefault();

    setupNodes();

    jsNode.onaudioprocess = function () {
      analyser.getByteTimeDomainData(ampArray);
      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    if (audioData == null) {
      loadSound(path);
    } else {
      playSound(audioData);
    }
  });

  document.getElementById('stop_btn').addEventListener('click', (e) => {
    e.preventDefault();
    sourceNode.stop(0);
    isPlaying = false;
  });

  function setupNodes() {
    sourceNode = audioCtx.createBufferSource();
    analyser = audioCtx.createAnalyser();
    jsNode = audioCtx.createScriptProcessor(sampleSize, 1, 1);
    ampArray = new Uint8Array(analyser.frequencyBinCount);

    sourceNode.connect(audioCtx.destination);
    sourceNode.connect(analyser);
    analyser.connect(jsNode);
    jsNode.connect(audioCtx.destination);

    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = 1;
  }

  function loadSound(url) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
      audioCtx.decodeAudioData(
        request.response,
        (buffer) => {
          audioData = buffer;
          playSound(audioData);
        },
        (e) => console.log(e)
      );
    };
    request.send();
  }

  function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
    isPlaying = true;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < ampArray.length; i++) {
      let value = ampArray[i] / 256;
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
      ctx.fillRect(i * w, height, w - 5, -y);
    }
  }
});
