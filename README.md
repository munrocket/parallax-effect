# parallax-tracking

Parallax effect in javascript using face tracking.

### Examples
* [background](https://munrocket.github.io/parallax-tracking/examples/background.html)
* [Three.js](https://munrocket.github.io/parallax-tracking/examples/threejs.html)

### Installation
Temporary without package. Copy `dist/parallax-tracking.js` into repo.

### Usage
In script tag
```js
  <script src="../dist/parallax-tracking.js"></script>
  <script>
    Parallax.init(( pos ) => {
      console.log( pos );
    });
  </script>
```
In ES modules
```js
  import { init as ParallaxInit } from '../dist/parallax-tracking.esm.js';
  ParallaxInit(( pos ) => {
    console.log( pos );
  });
```

### Roadmap

- [x] simple three.js demo
- [x] simple background demo
- [ ] gyroscope / mouse fallback

### References

1. Tsuyoshi Suenaga, Yasuyuki Tamai, etc. *Image-Based 3D Display with Motion Parallax using Face Tracking* ([PDF](https://www.researchgate.net/publication/4324515_Poster_Image-Based_3D_Display_with_Motion_Parallax_using_Face_Tracking))
2. Eric Lengyel. *Mathematics for 3D game programming and computer graphics* page ~120