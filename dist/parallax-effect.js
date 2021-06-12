(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Parallax = {}));
}(this, (function (exports) { 'use strict';

  const head = (function(i,n,j,e,c,t,s){t=n.createElement(j),s=n.getElementsByTagName(j)[0];t.appendChild(n.createTextNode(e.text));t.onload=c(e);s?s.parentNode.insertBefore(t,s):n.head.appendChild(t);});
  /**
   * Fetch Inject module.
   *
   * @module fetchInject
   * @license Zlib
   * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
   * @param {Promise} [promise] A promise to await before attempting injection.
   * @throws {Promise<ReferenceError>} Rejects with error when given no arguments.
   * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
   * @throws {Promise<Error>} Whatever `fetch` decides to throw.
   * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
   * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
   *     Objects containing `Response` `Body` properties used by the module.
   */
  const fetchInject = function (inputs, promise) {
    if (!arguments.length) return Promise.reject(new ReferenceError("Failed to execute 'fetchInject': 1 argument required but only 0 present."))
    if (arguments[0] && arguments[0].constructor !== Array) return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 1 must be of type 'Array'."))
    if (arguments[1] && arguments[1].constructor !== Promise) return Promise.reject(new TypeError("Failed to execute 'fetchInject': argument 2 must be of type 'Promise'."))
    const resources = [];
    const deferreds = promise ? [].concat(promise) : [];
    const thenables = [];
    inputs.forEach(input => deferreds.push(
      window.fetch(input).then(res => {
        return [res.clone().text(), res.blob()]
      }).then(promises => {
        return Promise.all(promises).then(resolved => {
          resources.push({ text: resolved[0], blob: resolved[1] });
        })
      })
    ));
    return Promise.all(deferreds).then(() => {
      resources.forEach(resource => {
        thenables.push({ then: resolve => {
          resource.blob.type.includes('text/css')
            ? head(window, document, 'style', resource, resolve)
            : head(window, document, 'script', resource, resolve);
        } });
      });
      return Promise.all(thenables)
    })
  };

  let video, model, eyes, dist;
  let opt = {};

  function init(pushUpdate, settings = {}) {
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

  exports.init = init;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
