window.loadFile = window.__execute || function() {
};
window.loadFile('three.js');
window.loadFile('promise.js');
window.loadFile('WebVR.js');
window.loadFile('VREffect.js');
window.loadFile('VRControls.js');

if (WEBVR.isLatestAvailable() === false) {
	document.body.appendChild(WEBVR.getMessage());
}


var texture,  video;
var controls, effect;
var renderer, camera, scene;

init();
animate();

function init() {
	document.addEventListener('click', function() {
		video.play();
	});

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
	camera.layers.enable(1); // render left view when no stereo available

	// video
	video = document.createElement('video');
	video.src   = 'http://30.11.153.22/a/tb.mov';
	video.loop  = true;
	video.muted = true;
	video.setAttribute('webkit-playsinline', 'webkit-playsinline');
	video.play();

	texture = new THREE.VideoTexture(video);
	texture.format    = THREE.RGBFormat;
	texture.minFilter = THREE.NearestFilter;
	texture.maxFilter = THREE.NearestFilter;
	texture.generateMipmaps = false;

	scene = new THREE.Scene();

	// left
	var geometry = new THREE.SphereGeometry(500, 60, 40);
	geometry.scale(-1, 1, 1);
	var uvs = geometry.faceVertexUvs[0];
	for (var i = 0; i < uvs.length; i++) {
		for (var j = 0; j < 3; j++) {
			uvs[i][j].x *= 0.5;
		}
	}

	var material = new THREE.MeshBasicMaterial({
		map : texture
	});

	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = -Math.PI / 2;
	mesh.layers.set(1); // display in left eye only
	scene.add(mesh);

	// right
	var geometry = new THREE.SphereGeometry(500, 60, 40);
	geometry.scale(-1, 1, 1);
	var uvs = geometry.faceVertexUvs[0];
	for (var i = 0; i < uvs.length; i++) {
		for (var j = 0; j < 3; j++) {
			uvs[i][j].x *= 0.5;
			uvs[i][j].x += 0.5;
		}

	}
	var material = new THREE.MeshBasicMaterial({
		map : texture
	});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = -Math.PI / 2;
	mesh.layers.set(2); // display in right eye only
	scene.add(mesh);

	//
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x101010);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//
	controls = new THREE.VRControls(camera);
	effect   = new THREE.VREffect(renderer);
	effect.scale = 0; // video doesn't need eye separation
	effect.setSize(window.innerWidth, window.innerHeight);

	if (WEBVR.isAvailable() === true) {
		document.body.appendChild(WEBVR.getButton(effect));
	}

	//
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	effect.requestAnimationFrame(animate);
	render();
}

function render() {
	controls.update();
	effect.render(scene, camera);
}
