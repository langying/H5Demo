window.loadFile = window.__execute || function() {};
window.loadFile('file:///asset/AppEngine.bundle/three.js');
window.loadFile('file:///asset/AppEngine.bundle/promise.js');
window.loadFile('file:///asset/AppEngine.bundle/WebVR.js');
window.loadFile('file:///asset/AppEngine.bundle/VREffect.js');
window.loadFile('file:///asset/AppEngine.bundle/VRControls.js');

var w = window.innerWidth;
var h = window.innerHeight;
var renderer = new THREE.WebGLRenderer();		// 创建渲染器
renderer.setSize(w, h);							// 设置渲染器为全屏
document.body.appendChild(renderer.domElement);	// 将渲染器添加到body上

var horse;
var clock	= new THREE.Clock();				// 创建时钟
var scene	= new THREE.Scene();				// 创建场景
var mixer	= new THREE.AnimationMixer(scene);	// 创建混合器
var camera	= new THREE.PerspectiveCamera(45, w / h, 0.01, 100);
var control	= new THREE.VRControls(camera);		// 控制器，用来控制摄像机
var effect	= new THREE.VREffect(renderer);		// 控制器，用来控制VR渲染
var loader	= new THREE.JSONLoader();			// 加载器，用于加载3D模型
loader.load("horse.json", function(geometry) {
	var material = new THREE.MeshLambertMaterial({ color: 0xFFAA55, morphTargets: true, vertexColors: THREE.FaceColors });
	horse = new THREE.Mesh(geometry, material);
	horse.speed		 = 550;
	horse.position.x = 100;
	horse.position.y = 0;
	horse.position.z = 300;
	horse.rotation.y = Math.PI / 2;
	
	scene.add(horse);
	mixer.clipAction(geometry.animations[0], horse).setDuration(1).startAt(-Math.random()).play();
});
//window.navigator.getUserMedia({ audio : true, video: { width: w, height: h }}, function(stream) {
//	var video = document.createElement('video');
//	video.src = stream;
//	video.play();
//
//	var image = new THREE.VideoTexture(video);
//	image.generateMipmaps = false;
//	image.format    = THREE.RGBAFormat;
//	image.maxFilter = THREE.NearestFilter;
//	image.minFilter = THREE.NearestFilter;
//	scene.background = image;					// 背景视频纹理
//}, null);

animate();
function animate() {
	effect.requestAnimationFrame(animate);
	if (horse) {
		var delta = clock.getDelta();
		mixer.update(delta);
		horse.position.x += horse.speed * delta;
		if (horse.position.x > 2000) {
			horse.position.x = -1000 - Math.random() * 500;
		}
	}

	control.update();
	effect.render(scene, camera);
}
