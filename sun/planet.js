
function Planet(radius, distance, rotation, revolution) {
	this.idx		= 0;
	this.delta		= 36.5;
	this.radius 	= radius;
	this.distance	= distance;
	this.rotation 	= rotation;
	this.revolution = revolution;
};
Planet.prototype = Planet;
Planet.prototype.constructor = Planet;
Planet.prototype.initMesh = function(map, bumpMap, bumpScale, specularMap, specular) {
	var meterial = {};
	if (map) {
		meterial.map = THREE.ImageUtils.loadTexture(map);
	}
	if (bumpMap) {
		meterial.bumpMap = THREE.ImageUtils.loadTexture(bumpMap);
	}
	if (bumpScale) {
		meterial.bumpScale = bumpScale;
	}
	if (specularMap) {
		meterial.specularMap = THREE.ImageUtils.loadTexture(specularMap);
	}
	if (specular) {
		meterial.bumpScale = new THREE.Color(specular);
	}
	this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 32), new THREE.MeshPhongMaterial(meterial));
	this.mesh.position.set(this.distance, 0, 0);
};
Planet.prototype.update = function() {
	if (this.revolution) {
		this.idx++;
		var angle = 2 * Math.PI * this.idx / this.revolution;
		this.mesh.position.x = this.distance * Math.cos(angle);
		this.mesh.position.y = this.distance * Math.sin(angle);
		this.mesh.rotation.z = angle;
	}
};

THREE.Planet = Planet;