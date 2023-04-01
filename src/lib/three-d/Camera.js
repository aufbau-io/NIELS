import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
	constructor() {
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;

		this.setInstance();
		this.setControls();
	}

	setInstance() {
		const aspectRatio = this.sizes.width / this.sizes.height;
		this.instance = new THREE.OrthographicCamera(
			-2.5 * aspectRatio,
			2.5 * aspectRatio,
			2.5,
			-2.5,
			-100,
			100
		);
		this.instance.position.set(6, 4, 8);
		this.scene.add(this.instance);
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.left = -2.5 * this.instance.aspect;
		this.instance.right = 2.5 * this.instance.aspect;
		this.instance.top = 2.5;
		this.instance.bottom = -2.5;

		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
