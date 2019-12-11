window.loadFile = window.__execute || function() {};
window.loadFile('three.js');
window.loadFile('Tween.js');
window.loadFile('planet.js');
window.loadFile('TrackballControls.js');

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.addEventListener('mouseup',  	onTouchEnd,   false);
document.addEventListener('touchend',  	onTouchEnd,   false);
document.addEventListener('mousedown',  onTouchStart, false);
document.addEventListener('touchstart', onTouchStart, false);

var datas = [
	new THREE.PlanetData('sun', 	25.00, 0.000, 4.0, 0.00, 'sun_map.png', 	null, null, null, null, null, null, null, null),
	new THREE.PlanetData('mercury', 58.00, 0.240, 0.6, 5.50, 'mercury_map.jpg', null, null, null, null, null, null, null, null),
	new THREE.PlanetData('venus', 	240.0, 0.620, 0.8, 8.00, 'venus_map.jpg',   null, null, null, null, null, null, null, null),
	new THREE.PlanetData('earth',   1.000, 1.000, 1.0, 11.2, 'earth_map.jpg',   null, null, null, null, null, null, null, null),
	new THREE.PlanetData('mars', 	1.000, 1.860, 0.6, 13.6, 'mars_map.png',	null, null, null, null, null, null, null, null),
	new THREE.PlanetData('jupiter', 0.400, 11.00, 2.0, 17.0, 'jupiter_map.jpg', null, null, null, null, null, null, null, null),
	new THREE.PlanetData('saturn',  0.500, 29.00, 1.5, 22.0, 'saturn_map.png',  null, null, null, null, null, 'saturn_ring.png',  1.2, 2.2),
	new THREE.PlanetData('uranus',  0.700, 84.00, 0.7, 26.4, 'uranus_map.jpg',  null, null, null, null, null, 'uranus_ring.png',  1.2, 2.2),
	new THREE.PlanetData('neptune', 0.700, 164.0, 0.6, 30.0, 'neptune_map.jpg', null, null, null, null, null, 'neptune_ring.png', 1.2, 2.2),
	new THREE.PlanetData('pluto',   6.400, 248.0, 0.5, 34.0, 'pluto_map.jpg',   null, null, null, null, null, null, null, null),
];

var moons = {
	'earth' : new THREE.PlanetData('moon', 1.000, 1.000, 0.2, 2.00, 'moon_map.png', null, null, null, null, null, null, null, null),
};

var solar  = null; // 太阳系
var planet = null; // 行星系
var system = null; // 当前的星系
var tween1 = null; // camera的up定时器
var tween2 = null; // camera的pt定时器
solar = system = new THREE.SolarSytem(datas);

var scene = new THREE.Scene();
scene.add(solar);
scene.add(new THREE.AmbientLight(0xFFFFFF));
scene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 32, 32), new THREE.MeshBasicMaterial({
	map : new THREE.TextureLoader().load('stars_map.png'),
	side: THREE.BackSide
})));

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.y = 100;
var controls = new THREE.TrackballControls(camera);

resetCameraPt();
render();

function initPlanet(idx) {
	scene.remove(solar);
	system = planet = new THREE.PlanetSystem(datas[idx], moons[datas[idx].id]);
	scene.add(planet);
    window.__handle && window.__handle(idx + '');
}
function resetCameraUp() {
    camera.lookAt(system.position);
    
	tween1 && tween1.stop();
	tween1 = new TWEEN.Tween(camera.up)
	.easing(TWEEN.Easing.Quintic.InOut)
	.interpolation(TWEEN.Interpolation.Linear)
	.to({x:0, y:1, z:0}, 3000)
	.onUpdate(function() {
		camera.up.set(this.x, this.y, this.z);
	}).start();
}
function resetCameraPt() {
	tween2 && tween2.stop();
	var position = (system instanceof THREE.SolarSytem) ? { x:53.7, y:12.1, z:11.4 } : { x:0, y:0, z:system.planet.data.radius * 2.5 };
	tween2 = new TWEEN.Tween(camera.position)
	.easing(TWEEN.Easing.Quintic.InOut)
	.interpolation(TWEEN.Interpolation.Linear)
	.to(position, 3000)
	.onUpdate(function() {
		camera.position.set(this.x, this.y, this.z);
	}).start();
}
function render() {
	requestAnimationFrame(render);
	TWEEN.update();
	controls.update();
	system.update();
	renderer.render(scene, camera);
}

var target = null;
var raycaster = new THREE.Raycaster();
function onTouchEnd(event) {
	event.preventDefault();
	if (system.targets.length <= 0 || (event.touches && event.touches.length > 1)) {
		target = null;
		return;
	}
	raycaster.setFromCamera(new THREE.Vector2((event.clientX/window.innerWidth)*2-1, -(event.clientY/window.innerHeight)*2+1), camera);
	var intersects = raycaster.intersectObjects(system.targets);
	if (intersects.length && target && target == intersects[0].object) {
		system.onClick(target, initPlanet);
		resetCameraUp();
		resetCameraPt();
	}
	target = null;
}
function onTouchStart(event) {
	event.preventDefault();
	if (system.targets.length <= 0 || (event.touches && event.touches.length > 1)) {
		target = null;
		return;
	}
    var x =  (event.clientX / window.innerWidth ) * 2 - 1;
    var y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
	var intersects = raycaster.intersectObjects(system.targets);
	if (intersects.length) {
		target = intersects[0].object;
	}
	else {
		target = null;
	}
}

function menu_home() {
	if (planet) {
		scene.remove(planet);
		planet.dispose();
		planet = null;
	}
	if (!solar.parent) {
		scene.add(solar);
	}
	system = solar;
	resetCameraUp();
    resetCameraPt();
    window.__handle('0');
}
function menu_reset() {
    resetCameraUp();
    resetCameraPt();
}