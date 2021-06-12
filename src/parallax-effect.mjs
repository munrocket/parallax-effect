import fetchInject from 'fetch-inject';

let video, model, eyes, dist;
let opt = {};

export function init(pushUpdate, settings = {}) {
  opt.pushUpdate = pushUpdate;
  opt.smoothEye = 0.8;
  opt.smoothDist = 0.25;
  opt.defautDist = 0.12;
  opt.threshold = 0.85;
  opt.tfUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@3.7.0/dist/tf-core.min.js';
  opt.wasmUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.7.0/dist/tf-backend-wasm.min.js';
  opt.wasmPath = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.7.0/dist/tfjs-backend-wasm.wasm';
  opt.convUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@3.7.0/dist/tf-converter.min.js';
  opt.modelUrl = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7/dist/blazeface.min.js';
  Object.assign(opt, settings);

  video = document.createElement('video');
  video.playsInline = true;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia({ video: true, facingMode: 'user' }).then((stream) => {
      fetchInject([
        opt.modelUrl
      ], fetchInject([
        opt.convUrl,
        opt.wasmUrl
      ], fetchInject([
        opt.tfUrl
      ]))).then(() => {
        return new Promise((resolve) => {
          video.srcObject = stream;
          video.play();
          video.onloadedmetadata = () => {
            video.width = video.videoWidth;
            video.height = video.videoHeight;
            tf.wasm.setWasmPath(opt.wasmPath);
            tf.setBackend('wasm').then(async () => {
              model = await blazeface.load();
              model.scoreThreshold = opt.threshold;
              resolve(requestAnimationFrame(render));
            }).catch(() => {
              reject('Internal error with wasm.');
            });
          };
        });
      });
    }).catch(() => {
      throw('Turn on camera or change browser.');
    });
  }
}

async function render() {
  let faces = await model.estimateFaces(video, false, true, true);
  if (faces.length > 0) {
    let e = faces[0].landmarks;
    let nextEyes = [e[0][0], e[0][1], e[1][0], e[1][1]];
    if (typeof eyes == 'undefined') {
      eyes = nextEyes;
    } else {
      for (let i = 0; i < 4; ++i) {
        eyes[i] *= 1 - opt.smoothEye;
        eyes[i] += nextEyes[i] * opt.smoothEye;
      }
    }

    let dx = eyes[0] - eyes[2];
    let dy = eyes[1] - eyes[3];
    let nextDist = Math.sqrt(dx * dx + dy * dy) / video.width;
    if (typeof dist == 'undefined') {
      dist = nextDist;
    } else {
      dist *= 1 - opt.smoothDist;
      dist += nextDist * opt.smoothDist;
    }

    opt.pushUpdate({
      x: (eyes[0] + eyes[2]) / video.width - 1,
      y: 1 - (eyes[1] + eyes[3]) / video.width,
      z: opt.defautDist / dist
    });
  }
  requestAnimationFrame(render);
}