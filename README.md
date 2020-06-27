# parallax-effect

Parallax effect in javascript using face tracking. Can be a good improvement for 3d scenes or Immersive Light Field Videos.

### Examples
* [background](https://munrocket.github.io/parallax-effect/examples/background.html)
* [three.js](https://munrocket.github.io/parallax-effect/examples/threejs.html)
* [deepview](https://munrocket.github.io/parallax-effect/examples/deepview.html)

### Installation

Install package `npm i parallax-effect` and add it as ES module
```js
  import { init as parallaxInit } from '../dist/parallax-effect.mjs';
  parallaxInit( position => {
    console.log( position );
  })
```
or add it in script tag
```js
  <script src="../dist/parallax-effect.js"></script>
  <script>
    Parallax.init( position => {
      console.log( position );
    })
  </script>
```

### Custom usage
Position is 3d vector where x/y in range [-0.5, 0.5] and z is positive, you can change settings (smoothing, default distance between eyes) or check for successfull init.
```js
Parallax.init(
  pos => {
    console.log( pos.x, pos.y, pos.z );
  }, {
    smoothEye: 0.8,
    smoothDist: 0.3,
    defautDist: 0.12,
    threshold = 0.85
  }
).then( isInited => {
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
