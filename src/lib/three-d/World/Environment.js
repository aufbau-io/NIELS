import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Environment {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.debug = this.experience.debug;
		this.intersect = new THREE.Vector3(0, 0, 0);

		this.scene.fog = new THREE.FogExp2(0xf0f0f0, 0.03);

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('environment');
		}

		this.setSunLight();

		this.gridHelper = new THREE.GridHelper(200, 100, 0xf0f0f0, 0xf0f0f0);
		this.scene.add(this.gridHelper);

		let onDocumentMouseMove = () => {
			// Calculate normalized device coordinates
			var mouse = new THREE.Vector2();
			mouse.x = window.experience.camera.cursor.x;
			mouse.y = window.experience.camera.cursor.y;

			console.log(mouse);

			var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, window.experience.camera.instance);
			var intersects = raycaster.intersectObject(this.gridHelper);

			if (intersects.length > 0) {
				this.intersect = intersects[0].point;
				// console.log('Position:', this.intersect);
			}
		};

		document.addEventListener('mousemove', onDocumentMouseMove, false);
	}

	setSunLight() {
		this.sunLight = new THREE.DirectionalLight('#3eb1c8', 1);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.camera.far = 15;
		this.sunLight.shadow.mapSize.set(1024, 1024);
		this.sunLight.shadow.normalBias = 0.05;
		this.sunLight.position.set(3.5, 2, -1.25);
		this.scene.add(this.sunLight);

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.sunLight, 'intensity')
				.name('sunLightIntensity')
				.min(0)
				.max(10)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, 'x')
				.name('sunLightX')
				.min(-5)
				.max(5)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, 'y')
				.name('sunLightY')
				.min(-5)
				.max(5)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, 'z')
				.name('sunLightZ')
				.min(-5)
				.max(5)
				.step(0.001);
		}
	}

	setEnvironmentMap() {
		this.environmentMap = {};
		this.environmentMap.intensity = 0.4;
		this.environmentMap.texture = this.resources.items.environmentMapTexture;
		this.environmentMap.texture.encoding = THREE.sRGBEncoding;

		this.scene.environment = this.environmentMap.texture;

		this.environmentMap.updateMaterials = () => {
			this.scene.traverse((child) => {
				if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
					child.material.envMap = this.environmentMap.texture;
					child.material.envMapIntensity = this.environmentMap.intensity;
					child.material.needsUpdate = true;
				}
			});
		};
		this.environmentMap.updateMaterials();

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.environmentMap, 'intensity')
				.name('envMapIntensity')
				.min(0)
				.max(4)
				.step(0.001)
				.onChange(this.environmentMap.updateMaterials);
		}
	}
}
