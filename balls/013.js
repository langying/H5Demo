window.require = window.__require || function() {};
window.require('three.js');
window.require('FresnelShader.js');

var container;

var camera, scene, renderer;
var cameraCube, sceneCube;

var mesh, zmesh, lightMesh, geometry;
var spheres = [];

var directionalLight, pointLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'touchmove', onDocumentMouseMove, false );

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.z = 3200;

    cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

    scene = new THREE.Scene();
    sceneCube = new THREE.Scene();


    var geometry = new THREE.SphereGeometry( 100, 32, 16 );

    var path = "";
    var format = '.jpg';
    var urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ];


    var textureCube = new THREE.CubeTextureLoader().load( urls );
    textureCube.format = THREE.RGBAFormat;

    var shader = THREE.FresnelShader;
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "tCube" ].value = textureCube;

    var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
    var material = new THREE.ShaderMaterial( parameters );

    for ( var i = 0; i < 10; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 6 + 3;

        scene.add( mesh );

        spheres.push( mesh );

    }

    scene.matrixAutoUpdate = false;

    // Skybox

    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        side: THREE.BackSide

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
    sceneCube.add( mesh );

    //

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    cameraCube.aspect = window.innerWidth / window.innerHeight;
    cameraCube.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    var timer = 0.0001 * Date.now();

    camera.position.x += (  mouseX - camera.position.x ) * .05;
    camera.position.y += ( -mouseY - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    cameraCube.rotation.copy( camera.rotation );

    for ( var i = 0, il = spheres.length; i < il; i ++ ) {

        var sphere = spheres[ i ];

        sphere.position.x = 5000 * Math.cos( timer + i );
        sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

    }

    renderer.clear();
    renderer.render( sceneCube, cameraCube );
    renderer.render( scene, camera );

}

