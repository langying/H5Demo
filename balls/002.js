window.require = window.__require || function() {};
window.require('three.js');

var width  = window.innerWidth;
var height = window.innerHeight;

var renderer;
function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 1.0);
    document.body.appendChild(renderer.domElement);
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.x = 0;
    camera.position.y = 1000;
    camera.position.z = 0;
    camera.up.x = 0;
    camera.up.y = 0;
    camera.up.z = 1;
    camera.lookAt({
        x : 0,
        y : 0,
        z : 0
    });
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

var light;
function initLight() {
    light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
    light.position.set(100, 100, 200);
    scene.add(light);
}

var cube;
function initCube() {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { vertexColors: true, linewidth: 100} );

    // 线的材质可以由2点的颜色决定
    var color1 = new THREE.Color( 0x0000FF );
    var color2 = new THREE.Color( 0xFF0000 );
    geometry.colors.push(color1, color2 );

    var point1 = new THREE.Vector3( -100, 0,  100 );
    var point2 = new THREE.Vector3(  100, 0, -100 );
    geometry.vertices.push(point1, point2);

    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    scene.add(line);
}

function start() {
    initRenderer();
    initCamera();
    initScene();
    initLight();
    initCube();
    render();
}

function render() {
	requestAnimationFrame(render);
	renderer.clear();
	renderer.render(scene, camera);
};

start();