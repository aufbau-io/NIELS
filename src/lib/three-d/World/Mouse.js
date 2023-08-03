import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Mouse {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		this.cursor = this.experience.camera.cursor;

		this.mousePath = []; // Array to store mouse positions
		this.pathLength = 25; // Number of points to store
		this.spline = new THREE.CatmullRomCurve3([]); // Spline curve

		// Resource
		this.resource = this.resources.items.mouse;
		this.setModel();
		this.setAnimation();
	}

	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(0.125, 0.125, 0.125);
		this.scene.add(this.model);

		this.gradientTexture = this.resources.items.gradientTexture;
		this.gradientTexture.magFilter = THREE.NearestFilter;

		let material = new THREE.MeshPhysicalMaterial({
			// semi-transulcent gradient
			map: this.gradientTexture,
			alphaMap: this.gradientTexture,
			roughness: 0.25,
			transmission: 1,
			thickness: 0.75 // Add refraction!
		});

		this.model.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
			}
			if (child.material) {
				child.material = material;
			}
		});
	}

	setAnimation() {
		this.animation = {};

		// Mixer
		this.animation.mixer = new THREE.AnimationMixer(this.model);

		// Actions
		this.animation.actions = {};

		this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[0]);

		this.animation.actions.current = this.animation.actions.running;
		this.animation.actions.current.play();

		// Play the action
		this.animation.play = (name) => {
			const newAction = this.animation.actions[name];
			const oldAction = this.animation.actions.current;

			newAction.reset();
			newAction.play();
			newAction.crossFadeFrom(oldAction, 1);

			this.animation.actions.current = newAction;
		};
	}

	update() {
		this.animation.mixer.update(this.time.delta * 0.001);

		// Get target position
		let targetPosition = window.experience.world.environment.intersect;

		// Store the target positions in an array
		this.mousePath.push(targetPosition.clone());

		// If we have too many points, remove the oldest
		if (this.mousePath.length > this.pathLength) {
			this.mousePath.shift();
		}

		// Update the spline to pass through each point
		this.spline.points = this.mousePath;

		// Calculate a position along the spline. 1 is the end of the spline, so
		// this will give the position of the mouse model a little way along the
		// path that the mouse has taken.
		if (this.mousePath.length > 1) {
			let newPosition = this.spline.getPoint(1);

			// Update the model's position to this new position
			this.model.position.lerp(newPosition, 0.02);
		}

		this.model.lookAt(window.experience.world.environment.intersect);
	}
}
