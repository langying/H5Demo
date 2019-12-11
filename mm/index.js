window.require = window.__require || function() {};
window.require('three.74.js');
window.require('charsetencoder.min.js');
window.require('ammo.js');
window.require('TGALoader.js');
window.require('MMDLoader.js');
window.require('CCDIKSolver.js');
window.require('MMDPhysics.js');

var mesh, camera, scene, renderer;
var helper;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var lastTime = Date.now();
if (typeof window.requestAnimationFrame === 'undefined') {
    window.requestAnimationFrame = function(callback) {
        var currentTime = Date.now();
        var delay = 16 + lastTime - currentTime;
        if (delay < 0) {
            delay = 0;
        }
        lastTime = currentTime;
        return setTimeout(function() {
            lastTime = Date.now();
            callback();
        }, delay);
    };
}
if (typeof window.cancelAnimationFrame === 'undefined') {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 25;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x666666 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0x887766 );
	directionalLight.position.set( -1, 1, 1 ).normalize();
	scene.add( directionalLight );

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( new THREE.Color( 0xffffff ) );
	document.body.appendChild( renderer.domElement );

	// model

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var modelFile = 'miku_v2.pmd';
	var vmdFiles = [ 'wavefile_v2.vmd' ];

	helper = new THREE.MMDHelper( renderer );

	var loader = new THREE.MMDLoader();
	loader.setDefaultTexturePath( '' );

	loader.load( modelFile, vmdFiles, function ( object ) {
		mesh = object;
		mesh.position.y = -10;
		helper.add( mesh );
		helper.setAnimation( mesh );
		helper.unifyAnimationDuration( { afterglow: 2.0 } );
		scene.add( mesh );
	}, onProgress, onError );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchmove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	camera.position.x += ( - mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	if ( mesh ) {
		helper.animate( clock.getDelta() );
		helper.render( scene, camera );
	}
	else {
		renderer.clear();
		renderer.render( scene, camera );
	}
}
