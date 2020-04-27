import { load } from '@tensorflow-models/blazeface';
import { setBackend } from '@tensorflow/tfjs-core';
import { setWasmPath } from '@tensorflow/tfjs-backend-wasm';
setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@latest/dist/tfjs-backend-wasm.wasm');

let model, video, screenDist, eyeDist, updateFun;

async function setupWebcam(video) {
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

export async function init(videoElement, screenDistance, eyeDiststance, updateFunction){
  video = videoElement;
  screenDist = screenDistance;
  eyeDist = eyeDiststance;
  updateFun = updateFunction;

  await setupWebcam(video);
  setBackend('wasm').then(async () => {
    model = await load();
    requestAnimationFrame(render);
  });
}

export async function render() {
  var estimation = video ? await model.estimateFaces(video, false, true, true) : 0;

  if (estimation && estimation.length > 0) {
    var landmarks = estimation[0].landmarks;
    var eye1 = { x: landmarks[ 0 ][ 0 ] / video.width, y: landmarks[ 0 ][ 1 ] / video.height };
    var eye2 = { x: landmarks[ 1 ][ 0 ] / video.width, y: landmarks[ 1 ][ 1 ] / video.height };
    var eye3 = { x: (eye1.x + eye2.x) / 2, y: (eye1.y + eye2.y) / 2 };

    var dx = eye2.x - eye1.x;
    var dy = eye2.y - eye1.y;
    var d = Math.sqrt(dx*dx + dy*dy);
    var headDist = screenDist * eyeDist / d;

    // var ray = new THREE.Ray();
    // ray.origin.setFromMatrixPosition( webcam.matrixWorld );
    // ray.direction.set( eyePos.x, eyePos.y, 0.5 ).unproject( webcam ).sub( ray.origin ).normalize();

    // headDist *= .06;
    // var headPos = new THREE.Vector3();
    // ray.at( headDist, headPos );

    // maincamera.position.copy( headPos );
    // maincamera.lookAt( webcam.position );
    // maincamera.fov = 6 * fov0 / headDist;
    // maincamera.updateProjectionMatrix();
    updateFun(eye3);
  }

  requestAnimationFrame(render);
};