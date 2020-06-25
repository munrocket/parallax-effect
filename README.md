# parallax-view

Parallax effect in javascript using face tracking. Can be a good improvement for 3d scenes or Immersive Light Field Videos.

### Examples
* [background](https://munrocket.github.io/parallax-view/examples/background.html)
* [three.js](https://munrocket.github.io/parallax-view/examples/threejs.html)
* [deepview](https://munrocket.github.io/parallax-view/examples/deepview.html)

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
  import { init as parallaxInit } from '../dist/parallax-view.mjs';
  parallaxInit( position => {
    console.log( position );
  }).then( isInited => {
    console.log( isInited );
  });
```

### Roadmap

- [x] background demo
- [x] three.js demo
- [x] deepview demo
- [ ] mouse / gyroscope fallback

### References

1. Eric Lengyel. *Oblique View Frustum Depth Projection and Clipping* [[url](https://www.semanticscholar.org/paper/Oblique-View-Frustum-Depth-Projection-and-Clipping-Lengyel/d4a4128a62e3ed060776b90a7e67c095e441b32d)]
