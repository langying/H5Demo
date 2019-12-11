function release(mesh) {
	if (mesh instanceof THREE.Mesh) {
		if (mesh.material.map) {
			mesh.material.map.dispose();
			mesh.material.map.image = null;
			mesh.material.map = null;
		}
		if (mesh.material.bumpMap) {
			mesh.material.bumpMap.dispose();
			mesh.material.bumpMap.image = null;
			mesh.material.bumpMap = null;
		}
		if (mesh.material.specularMap) {
			mesh.material.specularMap.dispose();
			mesh.material.specularMap.image = null;
			mesh.material.specularMap = null;
		}
		mesh.material.dispose();
		mesh.material = null;
		mesh.geometry.dispose();
		mesh.geometry = null;
	}
	else if (mesh instanceof THREE.Planet) {
		mesh.dispose();
	}
	else if (mesh instanceof THREE.SolarSytem) {
		mesh.dispose();
	}
	else if (mesh instanceof THREE.PlanetSystem) {
		mesh.dispose();
	}
	return mesh;
}

THREE.PlanetData = function(id, day, year, radius, distance, map, bump, bumpScale, spec, specColor, cloud, ring, ringIR, ringOR) {
	this.id       = id;
	this.day      = day;
	this.year     = year;
	this.radius   = radius;
	this.distance = distance;
	this.map  	   = map;
	this.bumpMap   = bump;
	this.bumpScale = bumpScale;
	this.specMap   = spec;
	this.specColor = specColor;
	this.cloud  = cloud;
	this.ring   = ring;
	this.ringIR = ringIR;
	this.ringOR = ringOR;
};
THREE.PlanetData.prototype = THREE.PlanetData;
THREE.PlanetData.prototype.constructor = THREE.PlanetData;

THREE.PlantRing = function(innerRadius, outerRadius) {
	THREE.Geometry.call(this);
	var segments = 128;
	var normal = new THREE.Vector3(0, 0, 1);
	for(var i = 0; i < segments; i++) {
		var angleLo	= ((i+0) / segments) * Math.PI*2;
		var angleHi	= ((i+1) / segments) * Math.PI*2;
		this.vertices.push( new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0) );
		this.vertices.push( new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0) );
		this.vertices.push( new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0) );
		this.vertices.push( new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0) );

		var vertexIdx = i * 4;
		// Create the first triangle
		this.faces.push(new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal));
		this.faceVertexUvs[0].push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(1, 0),
			new THREE.Vector2(0, 1)
		]);
		// Create the second triangle
		this.faces.push(new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal));
		this.faceVertexUvs[0].push([
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 0),
			new THREE.Vector2(1, 1)
		]);
	}
	this.computeFaceNormals();
	this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius);
};
THREE.PlantRing.prototype = Object.create(THREE.Geometry.prototype);
THREE.PlantRing.prototype.constructor = THREE.PlantRing;

THREE.Planet = function(data, prefix) {
	THREE.Object3D.call(this);
	this.data  = data;
	this.index = 0;
	this.delta = 36.5;

	var loader = new THREE.TextureLoader();
	if (data.map) {
		var meterial = { map : loader.load(prefix + data.map) };
		if (data.bumpMap) {
			meterial.bumpMap = loader.load(prefix + data.bumpMap);
		}
		if (data.bumpScale) {
			meterial.bumpScale = data.bumpScale;
		}
		if (data.specMap) {
			meterial.specularMap = loader.load(prefix + data.specMap);
		}
		if (data.specColor) {
			meterial.specular = new THREE.Color(data.specColor);
		}
		this.planet = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), new THREE.MeshPhongMaterial(meterial));
		this.add(this.planet);
	}
	if (data.cloud) {
		var meterial = { 
			map : loader.load(prefix + data.cloud), 
			transparent : true
		};
		this.cloud = new THREE.Mesh(new THREE.SphereGeometry(data.radius*1.01, 32, 32), new THREE.MeshPhongMaterial(meterial));
		this.add(this.cloud);
	}
	if (data.ring) {
		var meterial = {
			map	 	: loader.load(prefix + data.ring),
			side 	: THREE.DoubleSide,
			opacity	: 0.8,
			transparent	: true
		};
		this.ring = new THREE.Mesh(new THREE.PlantRing(data.radius*data.ringIR, data.radius*data.ringOR), new THREE.MeshPhongMaterial(meterial));
		this.ring.rotateX(Math.PI/2);
		this.add(this.ring);
	}
};
THREE.Planet.prototype = Object.create(THREE.Object3D.prototype);
THREE.Planet.prototype.constructor = THREE.Planet;
THREE.Planet.prototype.update = function() {
	if (this.data.distance > 0) {
		this.index++;
		var angle  = 2 * Math.PI * this.index / this.data.year / 400;
		var radius = this.data.distance;
		this.rotation.y = angle;
		this.position.x = radius * Math.sin(angle);
		this.position.z = radius * Math.cos(angle);
	}
};
THREE.Planet.prototype.dispose = function() {
	var children = this.children.slice(0);
	for (var idx = 0, len = children.length; idx < len; idx++) {
		this.remove(release(children[idx]));
	}
	children	= null;
	this.ring   = null;
	this.cloud  = null;
	this.planet = null;
};

THREE.SolarSytem = function(datas) {
	THREE.Object3D.call(this);
	this.index    = 0;
	this.datas    = datas;
	this.planets  = [];
	this.targets  = [];

	for (var idx = 0, len = datas.length; idx < len; idx++) {
		var data = datas[idx];
		var planet = new THREE.Planet(data, '1k/');
		this.add(planet);
		this.planets.push(planet);
		this.targets.push(planet.planet);

		if (data.distance) {
			var geometry = new THREE.Geometry();
		    var material = new THREE.LineBasicMaterial({ vertexColors: true });
		    for (var i = 0, angle = Math.PI * 2 / 128; i <= 128; i++) {
		    	geometry.colors.push(new THREE.Color(0x222222));
		    	geometry.vertices.push(new THREE.Vector3(data.distance * Math.cos(angle * i), 0, data.distance * Math.sin(angle * i)));
		    }
			this.add(new THREE.Line(geometry, material));
		}
	}
};
THREE.SolarSytem.prototype = Object.create(THREE.Object3D.prototype);
THREE.SolarSytem.prototype.constructor = THREE.SolarSytem;
THREE.SolarSytem.prototype.update = function() {
	for (var idx = 0, len = this.planets.length; idx < len; idx++) {
		this.planets[idx].update();
	}
	return this;
};
THREE.SolarSytem.prototype.onClick = function(target, handle) {
	handle && handle(this.targets.indexOf(target));
};
THREE.SolarSytem.prototype.dispose = function() {
	var children = this.children.slice(0);
	for (var idx = 0, len = children.length; idx < len; idx++) {
		this.remove(release(children[idx]));
	}
	children     = null;
	this.planets = null;
	this.targets = null;
};

THREE.PlanetSystem = function(data, moon) {
	THREE.Object3D.call(this);
	this.index   = 0;
	this.targets = [];
	if (data) {
		this.planet = new THREE.Planet(data, '4k/');
		this.add(this.planet);
	}
	if (moon) {
		this.moon = new THREE.Planet(moon, '4k/');
		this.add(this.moon);
	}
};
THREE.PlanetSystem.prototype = Object.create(THREE.Object3D.prototype);
THREE.PlanetSystem.prototype.constructor = THREE.PlanetSystem;
THREE.PlanetSystem.prototype.update = function() {
	var angle = 2 * Math.PI * this.index / 5000;
	this.planet.rotation.y = angle;
	this.moon && this.moon.update();
	this.index++;
	return this;
};
THREE.PlanetSystem.prototype.dispose = function() {
	var children = this.children.slice(0);
	for (var idx = 0, len = children.length; idx < len; idx++) {
		this.remove(release(children[idx]));
	}
	children     = null;
	this.moon    = null;
	this.planet  = null;
	this.targets = null;
};
