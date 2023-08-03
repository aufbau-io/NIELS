import Experience from '../Experience.js';
import Environment from './Environment.js';

import Mouse from './Mouse.js';

export default class World {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// Wait for resources
		this.resources.on('ready', () => {
			// Setup
			this.environment = new Environment();
			this.mouse = new Mouse();
		});
	}

	update() {
		if (this.mouse) this.mouse.update();
		if (this.environment) this.environment.update();
	}
}
