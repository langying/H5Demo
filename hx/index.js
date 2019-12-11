window.require = window.__require || function() {};
window.require('three.74.js');
window.require('TrackballControls.js');
window.require('PDBLoader.js');

var camera, scene, renderer, labelsRenderer;
var controls;

var root;

var MOLECULES = {
	"Ethanol": "ethanol.pdb",
	"Aspirin": "aspirin.pdb",
	"Caffeine": "caffeine.pdb",
	"Nicotine": "nicotine.pdb",
	"LSD": "lsd.pdb",
	"Cocaine": "cocaine.pdb",
	"Cholesterol": "cholesterol.pdb",
	"Lycopene": "lycopene.pdb",
	"Glucose": "glucose.pdb",
	"Aluminium oxide": "Al2O3.pdb",
	"Cubane": "cubane.pdb",
	"Copper": "cu.pdb",
	"Fluorite": "caf2.pdb",
	"Salt": "nacl.pdb",
	"YBCO superconductor": "ybco.pdb",
	"Buckyball": "buckyball.pdb",
	//"Diamond": "diamond.pdb",
	"Graphite": "graphite.pdb"
};

var loader = new THREE.PDBLoader();

init();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 1000;
	scene.add( camera );

	var light = new THREE.DirectionalLight( 0xffffff, 0.8 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( -1, -1, 1 );
	scene.add( light );

	root = new THREE.Group();
	scene.add( root );

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0x050505 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.minDistance = 500;
	controls.maxDistance = 2000;

	loadMolecule( "caffeine.pdb" );
}

//

function generateButtonCallback( url ) {
	return function ( event ) {
		loadMolecule( url );
	}
}
//

function loadMolecule( url ) {
	while ( root.children.length > 0 ) {

		var object = root.children[ 0 ];
		object.parent.remove( object );

	}

	loader.load( url, function ( geometry, geometryBonds, json ) {

		var boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		var sphereGeometry = new THREE.IcosahedronGeometry( 1, 2 );

		var offset = geometry.center();
		geometryBonds.translate( offset.x, offset.y, offset.z );

		for ( var i = 0; i < geometry.vertices.length; i ++ ) {
			var position = geometry.vertices[ i ];
			var color = geometry.colors[ i ];
			var element = geometry.elements[ i ];

			var material = new THREE.MeshPhongMaterial( { color: color } );

			var object = new THREE.Mesh( sphereGeometry, material );
			object.position.copy( position );
			object.position.multiplyScalar( 75 );
			object.scale.multiplyScalar( 25 );
			root.add( object );

			// var atom = json.atoms[ i ];

			// var text = document.createElement( 'div' );
			// text.className = 'label';
			// text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
			// text.textContent = atom[ 4 ];

			// var label = new THREE.CSS2DObject( text );
			// label.position.copy( object.position );
			// root.add( label );

		}

		for ( var i = 0; i < geometryBonds.vertices.length; i += 2 ) {
			var start = geometryBonds.vertices[ i ];
			var end = geometryBonds.vertices[ i + 1 ];

			start.multiplyScalar( 75 );
			end.multiplyScalar( 75 );

			var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
			object.position.copy( start );
			object.position.lerp( end, 0.5 );
			object.scale.set( 5, 5, start.distanceTo( end ) );
			object.lookAt( end );
			root.add( object );
		}

		render();
	}, function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
		}
	}, function ( xhr ) {
	} );

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();

	var time = Date.now() * 0.0004;

	root.rotation.x = time;
	root.rotation.y = time * 0.7;

	render();

}

function render() {

	renderer.render( scene, camera );
	// labelRenderer.render( scene, camera );

}

