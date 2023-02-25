import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Mouse {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.time = this.experience.time;
		this.debug = this.experience.debug;

		// Resource
		this.resource = this.resources.items.mouse;
		this.setModel();
		this.setAnimation();
	}

	setModel() {
		this.model = this.resource.scene;
		this.model.scale.set(0.1, 0.1, 0.1);
		this.scene.add(this.model);

		this.gradientTexture = this.resources.items.gradientTexture;
		this.gradientTexture.magFilter = THREE.NearestFilter;

		let material = new THREE.MeshToonMaterial({
			color: 0xe0e0d0,
			gradientMap: this.gradientTexture
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

		this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0]);
		// this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
		// this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2]);

		this.animation.actions.current = this.animation.actions.idle;
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
	}
}
