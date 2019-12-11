window.require = window.__require || function() {};
window.require('three.js');

var camera, scene, renderer;
var mesh;

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;
    scene = new THREE.Scene();

    // A begin
    var geometry = new THREE.PlaneGeometry( 500, 300, 1, 1 );
    geometry.vertices[0].uv = new THREE.Vector2(0,0);
    geometry.vertices[1].uv = new THREE.Vector2(1,0);
    geometry.vertices[2].uv = new THREE.Vector2(1,1);
    geometry.vertices[3].uv = new THREE.Vector2(0,1);
    // A end
    // B begin
    // 纹理坐标怎么弄
    var texture = THREE.ImageUtils.loadTexture("px.png", null, function(t) {
        console.log("px.png");
    });
    var material = new THREE.MeshBasicMaterial({map:texture});
    var mesh = new THREE.Mesh( geometry,material );
    scene.add( mesh );
    // B end

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

