import * as THREE from 'three';
import Experience from '../Experience.js';
import { get } from 'svelte/store';
import { screenType } from '$lib/store/store';

export default class Environment {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.debug = this.experience.debug;
		this.intersect = new THREE.Vector3(0, 0, 0);

		this.scene.fog = new THREE.FogExp2(0xd0d0d0, 0.025);
		this.clock = new THREE.Clock();

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('environment');
		}

		// this.setSunLight();

		// -------------------------------------------------------------------------

		const color1 = new THREE.Color(0xd0d0d0);
		const color2 = new THREE.Color(0x0000ff);
		const color3 = new THREE.Color(0x00ff00);
		const color4 = new THREE.Color(0x232323);

		// Mouse position
		let mouse = new THREE.Vector2();

		// Shader material
		this.shaderMaterial = new THREE.ShaderMaterial({
			vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
			fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    uniform vec3 color4;
    uniform float time;
    uniform vec2 mouse;

    float noise(vec2 position) {
      return fract(sin(dot(position, vec2(0, 90))) * 2.5453 + (mouse.x * 0.5)) - fract(sin(dot(position, vec2(90, 90))) * 3.5453 + (mouse.y * 0.5));
    }

    void main() {
      float n = noise(vUv) + (sin(time) * 0.15);
      vec3 color = mix(color1, color2, n);
      color = mix(color, color3, n*n);
      color = mix(color, color4, n*n*n)  ;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
			uniforms: {
				color1: { value: color1 },
				color2: { value: color2 },
				color3: { value: color3 },
				color4: { value: color4 },
				time: { value: 0 },
				mouse: { value: mouse }
			}
		});

		// Plane - double sided
		this.plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), this.shaderMaterial);
		this.plane.rotateZ(Math.PI / 2);
		this.plane.rotateY(Math.PI / 2);
		// plane.rotateX(Math.PI / 4);
		this.scene.add(this.plane);

		// -------------------------------------------------------------------------

		// this.space = new THREE.BoxGeometry((200, 1, 200));
		// this.gridHelper = new THREE.GridHelper(200, 100, 0x0b0b0b, 0x0b0b0b);
		// this.scene.add(this.gridHelper);

		let onDocumentMouseMove = () => {
			// Calculate normalized device coordinates
			var mouse = new THREE.Vector2();
			mouse.x = window.experience.camera.cursor.x;
			mouse.y = window.experience.camera.cursor.y;
			this.shaderMaterial.uniforms.mouse.value = mouse;

			var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, window.experience.camera.instance);
			var intersects = raycaster.intersectObject(this.plane);

			this.shaderMaterial.uniforms.mouse.value = mouse;

			if (intersects.length > 0) {
				this.intersect = intersects[0].point;
				// console.log('Position:', this.intersect);
			}
		};

		document.addEventListener('mousemove', onDocumentMouseMove, false);
	}

	// setSunLight() {
	// 	this.sunLight = new THREE.DirectionalLight('#232323', 1);
	// 	this.sunLight.castShadow = true;
	// 	this.sunLight.shadow.camera.far = 15;
	// 	this.sunLight.shadow.mapSize.set(1024, 1024);
	// 	this.sunLight.shadow.normalBias = 0.05;
	// 	this.sunLight.position.set(3.5, 2, -1.25);
	// 	this.scene.add(this.sunLight);

	// 	// Debug
	// 	if (this.debug.active) {
	// 		this.debugFolder
	// 			.add(this.sunLight, 'intensity')
	// 			.name('sunLightIntensity')
	// 			.min(0)
	// 			.max(10)
	// 			.step(0.001);

	// 		this.debugFolder
	// 			.add(this.sunLight.position, 'x')
	// 			.name('sunLightX')
	// 			.min(-5)
	// 			.max(5)
	// 			.step(0.001);

	// 		this.debugFolder
	// 			.add(this.sunLight.position, 'y')
	// 			.name('sunLightY')
	// 			.min(-5)
	// 			.max(5)
	// 			.step(0.001);

	// 		this.debugFolder
	// 			.add(this.sunLight.position, 'z')
	// 			.name('sunLightZ')
	// 			.min(-5)
	// 			.max(5)
	// 			.step(0.001);
	// 	}
	// }

	// setEnvironmentMap() {
	// 	this.environmentMap = {};
	// 	this.environmentMap.intensity = 0.4;
	// 	this.environmentMap.texture = this.resources.items.environmentMapTexture;
	// 	this.environmentMap.texture.encoding = THREE.sRGBEncoding;

	// 	this.scene.environment = this.environmentMap.texture;

	// 	this.environmentMap.updateMaterials = () => {
	// 		this.scene.traverse((child) => {
	// 			if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
	// 				child.material.envMap = this.environmentMap.texture;
	// 				child.material.envMapIntensity = this.environmentMap.intensity;
	// 				child.material.needsUpdate = true;
	// 			}
	// 		});
	// 	};
	// 	this.environmentMap.updateMaterials();

	// 	// Debug
	// 	if (this.debug.active) {
	// 		this.debugFolder
	// 			.add(this.environmentMap, 'intensity')
	// 			.name('envMapIntensity')
	// 			.min(0)
	// 			.max(4)
	// 			.step(0.001)
	// 			.onChange(this.environmentMap.updateMaterials);
	// 	}
	// }

	update() {
		this.shaderMaterial.uniforms.time.value = this.clock.getElapsedTime();

		if (get(screenType) == 1) {
			// this.plane.rotateX(1);
			this.shaderMaterial.uniforms.mouse.value = {
				x: this.clock.getElapsedTime() * 1,
				y: this.clock.getElapsedTime() * 0.1
			};
		}
	}
}
