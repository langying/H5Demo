window.require = window.__require || function() {};
window.require('three.js');
window.require('TrackballControls.js');

var light, system;
var scene = new THREE.Scene();

light = new THREE.AmbientLight(0x333333);
scene.add(light);

light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,3,5);
scene.add(light);

// 宇宙背景星星
var stars = new THREE.Mesh(
	new THREE.SphereGeometry(90, 64, 64), 
	new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/stars.png'),
		side: THREE.BackSide
	})
);
scene.add(stars);

// 太阳
var sun = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/000.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/000.jpg'),
		bumpScale: 0.05
	})
);
scene.add(sun);

// 水星
var mercury = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/100.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/101.jpg'),
		bumpScale: 0.005
	})
);
mercury.position.set(2, 0, 0);

var cycle1 = new THREE.Object3D();
cycle1.add(mercury);
scene.add(cycle1);

// 金星
var venus = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/200.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/201.jpg'),
		bumpScale: 0.005
	})
);
venus.position.set(4, 0, 0);

var cycle2 = new THREE.Object3D();
cycle2.add(venus);
scene.add(cycle2);

// 地球
var earth = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map:         THREE.ImageUtils.loadTexture('images/300.jpg'),
		bumpMap:     THREE.ImageUtils.loadTexture('images/301.jpg'),
		bumpScale:   0.005,
		specularMap: THREE.ImageUtils.loadTexture('images/302.png'),
		specular:    new THREE.Color('grey')						
	})
);
var cloud = new THREE.Mesh(
	new THREE.SphereGeometry(0.5 + 0.003, 32, 32),			
	new THREE.MeshPhongMaterial({
		map:         THREE.ImageUtils.loadTexture('images/310.png'),
		transparent: true
	})
);
var moon = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map:         THREE.ImageUtils.loadTexture('images/320.jpg'),
		bumpMap:     THREE.ImageUtils.loadTexture('images/321.jpg'),
		bumpScale:   0.005,
	})
);
moon.position.set(1, 0, 0);
moon.scale.multiplyScalar(0.2);

var cycle30 = new THREE.Object3D();
cycle30.position.set(6, 0, 0);
cycle30.add(earth);
cycle30.add(cloud)
cycle30.add(moon);

var cycle31 = new THREE.Object3D();
cycle31.add(cycle30);
scene.add(cycle31);

// 火星
var mars = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/400.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/401.jpg'),
		bumpScale: 0.05
	})
);
mars.position.set(4, 0, 0);
scene.add(mars);

// 木星
var jupiter = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/500.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/500.jpg'),
		bumpScale: 0.02
	})
);
jupiter.position.set(5, 0, 0);
scene.add(jupiter);

// 土星
var saturn = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/600.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/600.jpg'),
		bumpScale: 0.05
	})
);
saturn.position.set(6, 0, 0);
scene.add(saturn);

// 天王星
var uranus = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/700.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/700.jpg'),
		bumpScale: 0.05
	})
);
uranus.position.set(7, 0, 0);
scene.add(uranus);

// 海王星
var neptune = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/800.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/800.jpg'),
		bumpScale: 0.05
	})
);
neptune.position.set(8, 0, 0);
scene.add(neptune);

// 冥王星
var pluto = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 32, 32),
	new THREE.MeshPhongMaterial({
		map 	: THREE.ImageUtils.loadTexture('images/900.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('images/901.jpg'),
		bumpScale: 0.005
	})
);
pluto.position.set(9, 0, 0);
scene.add(pluto);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 1.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.TrackballControls(camera);

render();

function render() {
	controls.update();
	cycle1.rotation.y += 0.01;
	cycle2.rotation.y += 0.01;
	cycle30.rotation.y += 0.01;
	cycle31.rotation.y += 0.01;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
