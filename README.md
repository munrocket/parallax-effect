# parallax-view

Parallax effect in javascript using face tracking. Can be a good improvement for Immersive light field video ([DeepView](https://augmentedperception.github.io/deepviewvideo/)).

### Examples
* [background](https://munrocket.github.io/parallax-view/examples/background.html)
* [Three.js](https://munrocket.github.io/parallax-view/examples/threejs.html)
* [deepview](https://munrocket.github.io/parallax-view/examples/immersive.html)

### Installation
// under construction

### Usage
In script tag
```js
  <script src="../dist/parallax-view.js"></script>
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
  import { init as parallaxInit } from '../dist/parallax-view.esm.js';
  parallaxInit( position => {
    console.log( position );
  }).then( isInited => {
    console.log( isInited );
  });
```

### Roadmap

- [x] simple three.js demo
- [x] simple background demo
- [ ] mouse / gyroscope fallback

### References

1. Eric Lengyel. *Mathematics for 3D game programming and computer graphics* p. 120