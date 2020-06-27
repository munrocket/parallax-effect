import { load as blazeface } from '@tensorflow-models/blazeface';
import { setBackend } from '@tensorflow/tfjs-core';
import { setWasmPath } from '@tensorflow/tfjs-backend-wasm';
setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@1.7.4/dist/tfjs-backend-wasm.wasm');

let video, model, eyes, dist;
let param = {};

export function init(pushUpdate, settings = {}) {
  param.pushUpdate = pushUpdate;
  param.smoothEye = 0.8;
  param.smoothDist = 0.3;
  param.defautDist = 0.12;
  param.threshold = 0.85;
  Object.assign(param, settings);

  video = document.createElement('video');
  video.playsInline = true;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          setBackend('wasm').finally(async () => {
            model = await blazeface();
            model.scoreThreshold = param.threshold;
            requestAnimationFrame(render);
            resolve(true);
          });
        };
      });
    }).catch(() => {
      return false;
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
        eyes[i] *= 1 - param.smoothEye;
        eyes[i] += nextEyes[i] * param.smoothEye;
      }
    }

    let dx = eyes[0] - eyes[2];
    let dy = eyes[1] - eyes[3];
    let nextDist = Math.sqrt(dx * dx + dy * dy) / video.width;
    if (typeof dist == 'undefined') {
      dist = nextDist;
    } else {
      dist *= 1 - param.smoothDist;
      dist += nextDist * param.smoothDist;
    }

    param.pushUpdate({
      x: (eyes[0] + eyes[2]) / video.width - 1,
      y: 1 - (eyes[1] + eyes[3]) / video.width,
      z: param.defautDist / dist
    });
  }
  requestAnimationFrame(render);
}
