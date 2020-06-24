# parallax-tracking

Parallax effect in javascript using face tracking.

### Examples
* [background](https://munrocket.github.io/parallax-tracking/examples/background.html)
* [Three.js](https://munrocket.github.io/parallax-tracking/examples/threejs.html)
* [deepview](https://munrocket.github.io/parallax-tracking/examples/immersive.html)

### Installation
Temporary without package. Copy `dist/parallax-tracking[.esm].js` into repo.

### Usage
In script tag
```js
  <script src="../dist/parallax-tracking.js"></script>
  <script>
    Parallax.init( position => {
      console.log( position );
    }).then( isInited => {
      console.log( isInited );
    });
  </script>
```
In ES modules
```js
  import { init as ParallaxInit } from '../dist/parallax-tracking.esm.js';
  ParallaxInit( position => {
    console.log( position );
  }).then( isInited => {
    console.log( isInited );
  });
```

### Roadmap

- [x] simple three.js demo
- [x] simple background demo
- [ ] gyroscope / mouse fallback

### References

1. Eric Lengyel. *Mathematics for 3D game programming and computer graphics* p. 120