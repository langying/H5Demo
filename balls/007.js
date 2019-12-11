window.require = window.__require || function() {};
window.require('three.js');

var renderer;
function initThree() {
    width  = window.innerWidth;
    height = window.innerHeight;
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
    camera.position.x = 600;
    camera.position.y = 0;
    camera.position.z = 600;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
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
// A start
    light = new THREE.AmbientLight(0xFF0000);
    light.position.set(100, 100, 200);
    scene.add(light);
// A end

}

var cube;
function initObject() {
    var geometry = new THREE.CubeGeometry( 200, 100, 50,4,4);
    // B start
    var material = new THREE.MeshLambertMaterial( { color:0x880000} );
    // B end
    var mesh = new THREE.Mesh( geometry,material);
    mesh.position = new THREE.Vector3(0,0,0);
    scene.add(mesh);
}

function animation() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    animation();
}

threeStart();
