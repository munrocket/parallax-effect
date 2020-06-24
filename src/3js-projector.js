/** Three.js oblique projection */

export function Projector ( THREE, geometry, options ) {
	
    self = new THREE.Mesh( geometry );
	self.type = 'Projector';

	let scope = self;

	options = options || {};

	let color = ( options.color !== undefined ) ? new THREE.Color( options.color ) : new THREE.Color( 0x7F7F7F );
	let textureWidth = options.textureWidth || 512;
	let textureHeight = options.textureHeight || 512;
	let clipBias = options.clipBias || 0;
	let shader = options.shader || ProjectorShader;

	//

	let screenPlane = new THREE.Plane();
	let normal = new THREE.Vector3();
	let projectorWorldPosition = new THREE.Vector3();
	let cameraWorldPosition = new THREE.Vector3();
	let rotationMatrix = new THREE.Matrix4();
	let lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	let clipPlane = new THREE.Vector4();

	let view = new THREE.Vector3();
	let target = new THREE.Vector3();
	let q = new THREE.Vector4();

	let textureMatrix = new THREE.Matrix4();
	let virtualCamera = new THREE.PerspectiveCamera();

	let parameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: false
	};

	let renderTarget = new THREE.WebGLRenderTarget( textureWidth, textureHeight, parameters );

	if ( ! THREE.MathUtils.isPowerOfTwo( textureWidth ) || ! THREE.MathUtils.isPowerOfTwo( textureHeight ) ) {

		renderTarget.texture.generateMipmaps = false;

	}

	let material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader
	} );

	material.uniforms[ "tDiffuse" ].value = renderTarget.texture;
	material.uniforms[ "color" ].value = color;
	material.uniforms[ "textureMatrix" ].value = textureMatrix;

	self.material = material;

	self.onBeforeRender = function ( renderer, scene, camera ) {

		projectorWorldPosition.setFromMatrixPosition( scope.matrixWorld );
		cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );

		rotationMatrix.extractRotation( scope.matrixWorld );

		normal.set( 0, 0, 1 );
		normal.applyMatrix4( rotationMatrix );

		view.subVectors( projectorWorldPosition, cameraWorldPosition );

		// Avoid rendering when Projector is facing away

		if ( view.dot( normal ) > 0 ) return;

		view.reflect( normal ).negate();
		view.add( projectorWorldPosition );

		rotationMatrix.extractRotation( camera.matrixWorld );

		lookAtPosition.set( 0, 0, - 1 );
		lookAtPosition.applyMatrix4( rotationMatrix );
		lookAtPosition.add( cameraWorldPosition );

		target.subVectors( projectorWorldPosition, lookAtPosition );
		target.reflect( normal ).negate();
		target.add( projectorWorldPosition );

		virtualCamera.position.copy( view );
		virtualCamera.up.set( 0, 1, 0 );
		virtualCamera.up.applyMatrix4( rotationMatrix );
		virtualCamera.up.reflect( normal );
		virtualCamera.lookAt( target );

		virtualCamera.far = camera.far; // Used in WebGLBackground

		virtualCamera.updateMatrixWorld();
		virtualCamera.projectionMatrix.copy( camera.projectionMatrix );

		// Update the texture matrix
		textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		textureMatrix.multiply( virtualCamera.projectionMatrix );
		textureMatrix.multiply( virtualCamera.matrixWorldInverse );
		textureMatrix.multiply( scope.matrixWorld );

		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining self technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		screenPlane.setFromNormalAndCoplanarPoint( normal, projectorWorldPosition );
		screenPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

		clipPlane.set( screenPlane.normal.x, screenPlane.normal.y, screenPlane.normal.z, screenPlane.constant );

		let projectionMatrix = virtualCamera.projectionMatrix;

		q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
		q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
		q.z = - 1.0;
		q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

		// Calculate the scaled plane vector
		clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );

		// Replacing the third row of the projection matrix
		projectionMatrix.elements[ 2 ] = clipPlane.x;
		projectionMatrix.elements[ 6 ] = clipPlane.y;
		projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
		projectionMatrix.elements[ 14 ] = clipPlane.w;

		// Render

		renderTarget.texture.encoding = renderer.outputEncoding;

		scope.visible = false;

		let currentRenderTarget = renderer.getRenderTarget();

		let currentXrEnabled = renderer.xr.enabled;
		let currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

		renderer.xr.enabled = false; // Avoid camera modification
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

		renderer.setRenderTarget( renderTarget );

		renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

		if ( renderer.autoClear === false ) renderer.clear();
		renderer.render( scene, virtualCamera );

		renderer.xr.enabled = currentXrEnabled;
		renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

		renderer.setRenderTarget( currentRenderTarget );

		// Restore viewport

		let viewport = camera.viewport;

		if ( viewport !== undefined ) {

			renderer.state.viewport( viewport );

		}

		scope.visible = true;

	};

	self.getRenderTarget = function () {

		return renderTarget;

    };
    
    return self;

};

let ProjectorShader = {

	uniforms: {

		'color': {
			value: null
		},

		'tDiffuse': {
			value: null
		},

		'textureMatrix': {
			value: null
		}

	},

	vertexShader: [
		'uniform mat4 textureMatrix;',
		'varying vec4 vUv;',

		'void main() {',

		'	vUv = textureMatrix * vec4( position, 1.0 );',

		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join( '\n' ),

	fragmentShader: [
		'uniform vec3 color;',
		'uniform sampler2D tDiffuse;',
		'varying vec4 vUv;',

		'float blendOverlay( float base, float blend ) {',

		'	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',

		'}',

		'vec3 blendOverlay( vec3 base, vec3 blend ) {',

		'	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',

		'}',

		'void main() {',

		'	vec4 base = texture2DProj( tDiffuse, vUv );',
		'	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',

		'}'
	].join( '\n' )
};