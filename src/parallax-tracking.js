import { load as blazeface } from '@tensorflow-models/blazeface';
import { setBackend } from '@tensorflow/tfjs-core';
import { setWasmPath } from '@tensorflow/tfjs-backend-wasm';
setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@latest/dist/tfjs-backend-wasm.wasm');

let video, model, eyeDist, pushFun;

async function setupWebcam() {
  video = document.createElement('video');
  if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
    navigator.mediaDevices.getUserMedia( { video: true } ).then( function ( stream ) {
      video.srcObject = stream;
      video.play();
    });
  }
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.play();
      video.width = video.videoWidth;
      video.height = video.videoHeight;
      resolve(video);
    };
  });
}

export async function init(pushFunction, eyeDiststance = 0.13){
  pushFun = pushFunction;
  eyeDist = eyeDiststance;

  await setupWebcam(video);
  setBackend('wasm').then(async () => {
    model = await blazeface();
    model.scoreThreshold = 0.85;
    requestAnimationFrame(render);
  });
}

export async function render() {
  var estimation = video ? await model.estimateFaces(video, false, true, true) : 0;

  if (estimation && estimation.length > 0) {
    var landmarks = estimation[0].landmarks;
    var eye1 = { x: landmarks[ 0 ][ 0 ] / video.width, y: landmarks[ 0 ][ 1 ] / video.height };
    var eye2 = { x: landmarks[ 1 ][ 0 ] / video.width, y: landmarks[ 1 ][ 1 ] / video.height };
    var view = { x: (eye1.x + eye2.x) - 1, y: 1 - (eye1.y + eye2.y) };

    var dx = eye2.x - eye1.x;
    var dy = eye2.y - eye1.y;
    var d = Math.sqrt(dx*dx + dy*dy);
    var headDist = eyeDist / d;

    pushFun(view, headDist);
  }

  requestAnimationFrame(render, headDist);
};