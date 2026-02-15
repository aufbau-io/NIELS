<script>
	import { onMount, tick } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import GoldenRectangle from './objects/GoldenRectangle.svelte';

	let canvasElement;
	let scene, camera, renderer, controls;
	let animationFrameId;

	const PHI = (1 + Math.sqrt(5)) / 2;

	let projection = 1;
	let sceneReady = false;
	let useMouseControl = true;

	let rectangleComponents = [];

	// Mouse rotation state
	let targetQuaternion = new THREE.Quaternion();
	let currentQuaternion = new THREE.Quaternion();
	let mouseX = 0;
	let mouseY = 0;
	let baseDistance = 10;

	const vertices = [
		[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
		[0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
		[PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]
	];

	const faces = [
		[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
		[1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
		[3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
		[4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
	];

	const edges = [
		[0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
		[1, 5], [1, 7], [1, 8], [1, 9],
		[2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
		[3, 4], [3, 6], [3, 8], [3, 9],
		[4, 5], [4, 9], [4, 11],
		[5, 9], [5, 11],
		[6, 7], [6, 8], [6, 10],
		[7, 8], [7, 10],
		[8, 9],
		[10, 11]
	];

	const rectangleConfigs = [
		{ indices: [0, 1, 3, 2], axis: new THREE.Vector3(0, 0, 1), direction: 1 },
		{ indices: [0, 1, 3, 2], axis: new THREE.Vector3(0, 0, 1), direction: -1 },
		{ indices: [4, 5, 7, 6], axis: new THREE.Vector3(1, 0, 0), direction: 1 },
		{ indices: [4, 5, 7, 6], axis: new THREE.Vector3(1, 0, 0), direction: -1 },
		{ indices: [8, 9, 11, 10], axis: new THREE.Vector3(0, 1, 0), direction: 1 },
		{ indices: [8, 9, 11, 10], axis: new THREE.Vector3(0, 1, 0), direction: -1 }
	];

	function createIcosahedron() {
		const geometry = new THREE.BufferGeometry();
		const positions = [];

		faces.forEach((face) => {
			const [a, b, c] = face;
			positions.push(...vertices[a], ...vertices[b], ...vertices[c]);
		});

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.computeVertexNormals();

		return new THREE.Mesh(
			geometry,
			new THREE.MeshBasicMaterial({
				color: 0xf0f0f0,
				transparent: true,
				opacity: 0.0,
				side: THREE.DoubleSide,
				depthWrite: true
			})
		);
	}

	function createWireframe() {
		const positions = [];
		edges.forEach(([a, b]) => {
			positions.push(...vertices[a], ...vertices[b]);
		});

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

		return new THREE.LineSegments(
			geometry,
			new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 1.0 })
		);
	}

	function updateProjection() {
		rectangleComponents.forEach(comp => {
			if (comp && comp.updateProjection) {
				comp.updateProjection(projection);
			}
		});
	}

	function handleMouseMove(e) {
		if (!useMouseControl) return;
		
		mouseX = (e.clientX / window.innerWidth) * 2 - 1;
		mouseY = (e.clientY / window.innerHeight) * 2 - 1;
		
		updateTargetQuaternion();

		rectangleComponents.forEach(comp => {
			if (comp && comp.updateProjection) {
				comp.updateProjection(projection + mouseX * 0.5 );
			}
		});
	}

	function updateTargetQuaternion() {
		// Convert mouse position to rotation angles
		const rotY = mouseX * Math.PI * 0.5;
		const rotX = mouseY * Math.PI * 0.4;
		
		// Create quaternion from euler angles
		const euler = new THREE.Euler(rotX, rotY, 0, 'YXZ');
		targetQuaternion.setFromEuler(euler);
	}

	// function toggleControlMode() {
	// 	useMouseControl = !useMouseControl;
		
	// 	if (useMouseControl) {
	// 		controls.enabled = false;
	// 		// Capture current camera orientation
	// 		currentQuaternion.copy(camera.quaternion);
	// 		targetQuaternion.copy(camera.quaternion);
	// 	} else {
	// 		controls.enabled = true;
	// 	}
	// }

	function animate() {
		animationFrameId = requestAnimationFrame(animate);
		
		if (useMouseControl) {
			// Smooth quaternion interpolation
			currentQuaternion.slerp(targetQuaternion, 0.08);
			
			// Apply rotation to camera position (orbit around origin)
			const offset = new THREE.Vector3(0, 0, baseDistance);
			offset.applyQuaternion(currentQuaternion);
			camera.position.copy(offset);
			camera.lookAt(0, 0, 0);
		} else {
			controls.update();
		}
		
		renderer.render(scene, camera);
	}

	const frustumSize = 12;
	
	function handleResize() {
		const aspect = window.innerWidth / window.innerHeight;
		camera.left = -frustumSize * aspect / 2;
		camera.right = frustumSize * aspect / 2;
		camera.top = frustumSize / 2;
		camera.bottom = -frustumSize / 2;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onMount(async () => {
		scene = new THREE.Scene();

		const aspect = window.innerWidth / window.innerHeight;
		camera = new THREE.OrthographicCamera(
			-frustumSize * aspect / 2,
			frustumSize * aspect / 2,
			frustumSize / 2,
			-frustumSize / 2,
			0.1,
			100
		);
		camera.position.set(0, 0, baseDistance);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0xf0f0f0, 0);

		controls = new OrbitControls(camera, canvasElement);
		controls.enableDamping = true;
		controls.enabled = !useMouseControl;

		scene.add(createIcosahedron());
		scene.add(createWireframe());

		// Initialize quaternions from starting camera position
		camera.position.set(5, 4, 5);
		camera.lookAt(0, 0, 0);
		currentQuaternion.copy(camera.quaternion);
		targetQuaternion.copy(camera.quaternion);

		sceneReady = true;
		await tick();

		// Init all rectangle components
		for (const comp of rectangleComponents) {
			if (comp) {
				await comp.init();
			}
		}

		// Wait another tick for schematics to mount
		await tick();

		// Now apply initial projection
		updateProjection();

		animate();

		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(animationFrameId);
			rectangleComponents.forEach(comp => {
				if (comp) comp.dispose();
			});
			renderer.dispose();
			controls.dispose();
		};
	});
</script>

{#if sceneReady}
	{#each rectangleConfigs as config, i}
		<GoldenRectangle
			bind:this={rectangleComponents[i]}
			{scene}
			axis={config.axis}
			direction={config.direction}
			{vertices}
			indices={config.indices}
		/>
	{/each}
{/if}

<canvas bind:this={canvasElement}></canvas>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
		font-family: monospace;
	}
	
	canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}

</style>