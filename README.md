# parallax-tracking

Parallax effect in javascript using face tracking.

### Motivation

### Examples
* [for background](https://munrocket.github.io/parallax-tracking/examples/background.html)
* [for three.js](https://munrocket.github.io/parallax-tracking/examples/threejs.html)

### Installation
```shell
npm i parallax-tracking ( not published yet )
```

### Usage
```js
  import ParallaxTracking from 'parallax-tracking';
  ParallaxTracking.init(( pos ) => {
    console.log( pos );
  });
```

### References

1. Tsuyoshi Suenaga, Yasuyuki Tamai, etc. *Image-Based 3D Display with Motion Parallax using Face Tracking* ([PDF](https://www.researchgate.net/publication/4324515_Poster_Image-Based_3D_Display_with_Motion_Parallax_using_Face_Tracking))
2. Eric Lengyel. *Mathematics for 3D game programming and computer graphics* page ~120