# parallax-effect [![bundlephobia](https://badgen.net/bundlephobia/minzip/parallax-effect)](https://bundlephobia.com/result?p=parallax-effect)

Parallax effect in javascript using face tracking, can be a good improvement for 3d scenes. If the user prohibits using the camera,
nothing loads. This library uses TFJS with WASM backend on CPU, so your GPU will be free.

### Examples
* [background](https://munrocket.github.io/parallax-effect/examples/background.html)
* [three.js](https://munrocket.github.io/parallax-effect/examples/threejs.html)
* [deepview](https://munrocket.github.io/parallax-effect/examples/deepview.html)

![](https://habrastorage.org/webt/rj/65/g9/rj65g9_jtm2rgljgmk6yu5sjf6k.jpeg)

### Installation

Run `npm install parallax-effect` and import it as ES module
```js
  import * as Parallax from '../dist/parallax-effect.mjs';
  Parallax.init( view => {
    console.log( view );
  } );
```
or add it in script tag
```js
  <script src="../dist/parallax-effect.js"></script>
  <script>
    Parallax.init( view => {
      console.log( view );
    } );
  </script>
```

### Usage
*View* is a 3d vector with components similar to spherical coordinates: x/y in range [-1, 1] it's a value proportional to angle (because α ≈ sin(α)) and z is a value proportional to distance from camera to head. Also you can check for successfull init or change default settings: smoothing, default distance between eyes to change z, threshold in blazeface model or change tfjs source links from jsdelivr to unpkg / own server.
```js
Parallax.init(
  view => {
    console.log( view.x, view.y, view.z );
  }, {
    smoothEye: 0.8,
    smoothDist: 0.25,
    defautDist: 0.12,
    threshold = 0.85
  }
).then( errorCode => {
  console.log( errorCode );
} );
```

### Roadmap

- [x] proper examples
- [x] ema smoothing
- [x] iOS fix for camera
- [x] lazy load for tfjs
- [ ] mouse/gyroscope fallback

### References

1. Eric Lengyel. *Oblique View Frustum Depth Projection and Clipping* [[url](https://www.semanticscholar.org/paper/Oblique-View-Frustum-Depth-Projection-and-Clipping-Lengyel/d4a4128a62e3ed060776b90a7e67c095e441b32d)]
