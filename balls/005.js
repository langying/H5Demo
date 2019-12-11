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
    //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 );
    camera.position.x = 0;
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
    light = new THREE.AmbientLight(0xFF0000);
    light.position.set(100, 100, 200);
    scene.add(light);
    
    light = new THREE.PointLight(0x00FF00);
    light.position.set(0, 0,300);
    scene.add(light);
}

var geometry, material;
function initObject() {
    geometry = new THREE.CylinderGeometry( 70,100,200);
    material = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position = new THREE.Vector3(0,0,0);
    scene.add(mesh);
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    animation();
}

function animation()
{
    changeFov();
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
}

var fov = 10;
var idx = 0.2
function changeFov()
{
    fov += idx;
    if (fov >= 160 || fov <= 10) {
        idx = -idx;
    }
    camera.fov = fov;
    camera.updateProjectionMatrix();
}

threeStart();
