# parallax-effect [![bundlephobia](https://badgen.net/bundlephobia/minzip/parallax-effect)](https://bundlephobia.com/result?p=parallax-effect)

Parallax effect in javascript using face tracking, can be a good improvement for 3d scenes. This library uses TFJS with WASM backend on CPU, so your GPU will be free. Supports lazy loading.

Inspired by [@lucknknock](https://twitter.com/lucknknock) C# demo

### Live examples
* [deepview](https://munsocket.github.io/parallax-effect/examples/deepview.html)
* [pixi.js](https://munsocket.github.io/parallax-effect/examples/pixi.html)
* [three.js](https://munsocket.github.io/parallax-effect/examples/threejs.html)

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
  <script src="https://cdn.jsdelivr.net/npm/parallax-effect/dist/parallax-effect.min.js"></script>
  <script>
    Parallax.init( view => {
      console.log( view );
    } );
  </script>
```

### Usage
*View* in code below is a 3d vector with components similar to spherical coordinates: x/y in range [-1, 1] and proportional to angle, z is proportional to distance from camera to head. Also you can check for successfull init or change default settings: smoothing, default distance between eyes to change z, threshold in blazeface model or change tfjs source links from jsdelivr to unpkg / own server.
```js
Parallax.init(
  view => {
    console.log( view.x, view.y, view.z );
  }, {
    smoothEye: 0.8, // smoothing eye (x, y)
    smoothDist: 0.25, // smoothing distance (z)
    defautDist: 0.12, // parameter for distance estimation
    threshold = 0.85 // blazeface detection probability
  }
).then( rafId => {
  console.log( 'cancelAnimationFrame(' + rafId + ')' );
}).catch( errorMessage => {
  console.log( errorMessage );
} );
```

### Roadmap

- [x] smoothing head detection with EMA
- [x] support for iOS/Macs
- [x] lazy load for tfjs
- [x] three.js/pixi.js examples
- [x] mouse fallback
- [ ] gyroscope fallback

### Contribution

Feel free to make issues or/and contribute.
