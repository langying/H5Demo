window.require = window.__require || function() {};
window.require('three.js');

var container;

var camera, scene, renderer;
var cacube, sceneCube;

var mesh, lightMesh, geometry;
var spheres = [];

var directionalLight, pointLight;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth  / 2;
var windowHalfY = window.innerHeight / 2;
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('touchmove', onDocumentMouseMove, false);

init();
animate();

function init() {
	cacube = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.z = 3200;

	scene 		= new THREE.Scene();
	sceneCube 	= new THREE.Scene();

	// Skybox
	var textureCube = new THREE.CubeTextureLoader().load([ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]);
	var shader = THREE.ShaderLib["cube"];
	shader.uniforms["tCube"].value = textureCube;
	
	var material = new THREE.ShaderMaterial({
	    fragmentShader 	: shader.fragmentShader,
	    vertexShader 	: shader.vertexShader,
	    uniforms 		: shader.uniforms,
	    depthWrite 		: false,
	    side 			: THREE.BackSide
	}),
	mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
	sceneCube.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function animate() {
	render();
	requestAnimationFrame(animate);
}

function render() {
	camera.position.x += ( mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * .05;
	camera.lookAt(scene.position);
	
	cacube.rotation.copy(camera.rotation);

	renderer.render(sceneCube, cacube);
	// renderer.render(scene, camera);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2,

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	cacube.aspect = window.innerWidth / window.innerHeight;
	cacube.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) * 10;
	mouseY = (event.clientY - windowHalfY) * 10;
}
