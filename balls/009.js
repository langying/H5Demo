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
//  light = new THREE.AmbientLight(0xFF0000);
//  light.position.set(100, 100, 200);
//  scene.add(light);
    // 聚光灯
    light = new THREE.DirectionalLight(0xFF0000);
    light.position.set(0, 0,1);
    scene.add(light);
}

// A start 
var cube;
function initObject() {
    var geometry = new THREE.CubeGeometry( 200, 100, 50,4,4);
    var material = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
    var mesh = new THREE.Mesh( geometry,material);
    mesh.position.set(0,0,0);
    scene.add(mesh);

    var geometry2 = new THREE.CubeGeometry( 200, 100, 50,4,4);
    var material2 = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
    var mesh2 = new THREE.Mesh( geometry2,material2);
    mesh2.position.set(-300,0,0);
    scene.add(mesh2);

    var geometry3 = new THREE.CubeGeometry( 200, 100, 50,4,4);
    var material3 = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
    var mesh3 = new THREE.Mesh( geometry3,material3);
    mesh3.position.set(0,-150,0);
    scene.add(mesh3);

    var mesh4 = new THREE.Mesh( geometry3,material3);
    mesh4.position.set(0,150,0);
    scene.add(mesh4);

    var mesh5 = new THREE.Mesh( geometry3,material3);
    mesh5.position.set(300,0,0);
    scene.add(mesh5);

    var mesh6 = new THREE.Mesh( geometry3,material3);
    mesh6.position.set(0,0,-100);
    scene.add(mesh6);

}
// A end

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    animation();
}

function animation() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

threeStart();
