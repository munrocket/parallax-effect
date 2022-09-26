let video, model, e, dist, rx, ry, rz;
let opt = {};

export function init(pushUpdate, settings = {}) {
  opt.pushUpdate = pushUpdate;
  opt.smoothEye = 0.5;
  opt.smoothDist = 0.25;
  opt.defautDist = 0.12;
  opt.smoothRotors = 0.2;
  opt.threshold = 0.85;
  opt.wasmPath = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.8.0/dist/';
  Object.assign(opt, settings);

  video = document.createElement('video');
  video.playsInline = true;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia({ video: true, facingMode: 'user' }).then((stream) => {
      return new Promise((resolve) => {
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          tf.wasm.setWasmPaths(opt.wasmPath);
          tf.setBackend('wasm').then(async () => {
            model = await blazeface.load();
            model.scoreThreshold = opt.threshold;
            resolve(requestAnimationFrame(render));
          }).catch(() => {
            console.log('Internal error with wasm.');
          });
        };
      });
    });
  }
}

async function render() {
  let faces = await model.estimateFaces(video, false, true, true);
  if (faces.length > 0) {
    let m = faces[0].landmarks;
    let e2 = [[m[0][0], m[0][1]], [m[1][0], m[1][1]],  //eyes rl
              [m[2][0], m[2][1]], [m[3][0], m[3][1]], //nose + mouth
              [m[4][0], m[4][1]], [m[5][0], m[5][1]]]; //ears rl
    if (typeof eyes == 'undefined') {
      e = e2;
    } else {
      for (let i = 0; i < 6; ++i) {
        e[i][0] *= 1 - opt.smoothEye;
        e[i][1] *= 1 - opt.smoothEye;
        e[i][0] += e2[i][0] * opt.smoothEye;
        e[i][1] += e2[i][1] * opt.smoothEye;
      }
    }

    //avg left ear and right ear
    const o_x = (e[4][0] + e[5][0]) / 2;
    const o_y = (e[4][1] + e[5][1]) / 2;

    //oZ = noise - origin (z)
    const oz_x = e[2][0] - o_x;
    const oz_y = e[2][1] - o_y;

    //oX = rightEar - origin (x)
    const ox_x = e[4][0] - o_x;
    const ox_y = e[4][1] - o_y;

    //oY = avg_eyes - mouth
    const oy_x = (e[0][0] + e[1][0]) * 0.5 - e[3][0];
    const oy_y = (e[0][1] + e[1][1]) * 0.5 - e[3][1];
    const oy = Math.sqrt(oy_x*oy_x + oy_y*oy_y);

    let dx = e[4][0] - e[5][0];
    let dy = e[4][1] - e[5][1];
    let nextDist = Math.sqrt(dx * dx + dy * dy) / video.width;
    if (typeof dist == 'undefined') {
      dist = nextDist;
    } else {
      dist *= 1 - opt.smoothDist;
      dist += nextDist * opt.smoothDist;
    }

    let rx2 = .8 * (oz_y / oy - .3);
    let ry2 = .5 * oz_x / oy;
    let rz2 = - ox_y / oy;
    if (typeof rx == 'undefined') {
      rx = rx2;
    } else {
      rx *= 1 - opt.smoothRotors;
      rx += rx2 * opt.smoothRotors;
    }
    if (typeof ry == 'undefined') {
      ry = ry2;
    } else {
      ry *= 1 - opt.smoothRotors;
      ry += ry2 * opt.smoothRotors;
    }
    if (typeof rz == 'undefined') {
      rz = rz2;
    } else {
      rz *= 1 - opt.smoothRotors;
      rz += rz2 * opt.smoothRotors;
    }

    opt.pushUpdate({
      x: (e[4][0] + e[5][0]) / video.width - 1,
      y: 1 - (e[4][1] + e[5][1]) / video.width,
      z: opt.defautDist / dist,
      rx,
      ry,
      rz,
    });
  }
  requestAnimationFrame(render);
}