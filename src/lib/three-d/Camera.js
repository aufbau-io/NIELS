import * as THREE from 'three';
import Experience from './Experience.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ASPECT_FACTOR = 5;

export default class Camera {
	constructor() {
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;

		this.cursor = { x: 0, y: 0 };

		this.setInstance();
		this.setControls();
	}

	setInstance() {
		const aspectRatio = this.sizes.width / this.sizes.height;
		this.instance = new THREE.OrthographicCamera(
			-ASPECT_FACTOR * aspectRatio,
			ASPECT_FACTOR * aspectRatio,
			ASPECT_FACTOR,
			-ASPECT_FACTOR,
			-100,
			100
		);
		this.instance.position.set(10, 5, 10);
		this.scene.add(this.instance);

		window.addEventListener('mousemove', (event) => {
			this.cursor.x = (event.clientX / this.sizes.width) * ASPECT_FACTOR * 2 - ASPECT_FACTOR;
			this.cursor.y = (event.clientY / this.sizes.height) * -ASPECT_FACTOR * 2 + ASPECT_FACTOR;

			// console.log(this.cursor);
		});
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = true;
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.left = -ASPECT_FACTOR * this.instance.aspect;
		this.instance.right = ASPECT_FACTOR * this.instance.aspect;
		this.instance.top = ASPECT_FACTOR;
		this.instance.bottom = -ASPECT_FACTOR;

		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
