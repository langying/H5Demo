window.require = window.__require || function() {};
window.require('three.js');
window.require('TrackballControls.js');

var planets = [];
var positions = [
	[0.2, 0.0, 0.0, 0.0],
	[0.2, 1.0, 1.0, 100],
	[0.2, 2.0, 1.0, 200],
	[0.2, 3.0, 1.0, 365],
	[0.2, 4.0, 1.0, 400],
	[0.2, 5.0, 1.0, 500],
	[0.2, 6.0, 1.0, 600],
	[0.2, 7.0, 1.0, 700],
	[0.2, 8.0, 1.0, 800],
	[0.2, 9.0, 1.0, 900]
];

var meterials = [
	['images/000.jpg', 'images/000.jpg', 0.05, null, null],
	['images/100.jpg', 'images/101.jpg', 0.05, null, null],
	['images/200.jpg', 'images/201.jpg', 0.05, null, null],
	['images/300.jpg', 'images/301.jpg', 0.05, 'images/302.png', 'grey'],
	['images/400.jpg', 'images/401.jpg', 0.05, null, null],
	['images/500.jpg', 'images/500.jpg', 0.02, null, null],
	['images/600.jpg', 'images/600.jpg', 0.05, null, null],
	['images/700.jpg', 'images/700.jpg', 0.05, null, null],
	['images/800.jpg', 'images/800.jpg', 0.05, null, null],
	['images/900.jpg', 'images/901.jpg', 0.05, null, null]
];

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 1.5;

var controls = new THREE.TrackballControls(camera);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var light = new THREE.AmbientLight(0x333333);
scene.add(light);

light = new THREE.PointLight(0xFFFFFF, 1, 0);
light.position.set(0, 0, 0);
scene.add(light);

for (var idx = 0, len = positions.length; idx < len; idx++) {
	var pt = positions[idx];
	var mt = meterials[idx];
	var planet = new THREE.Planet(pt[0], pt[1], pt[2], pt[3]);
	planet.initMesh(mt[0], mt[1], mt[2], mt[3], mt[4]);
	planets.push(planet);
	scene.add(planet.mesh);
}

render();

function render() {
	requestAnimationFrame(render);
	controls.update();
	for (var i = 0; i < planets.length; i++) {
		planets[i].update();
	};
	renderer.render(scene, camera);
}
