<script>
	import { onMount } from 'svelte';
	import { darkMode } from '$lib/store/store';
	import * as THREE from 'three';

	let container, pc;
	// Setting up the scene
	let scene = new THREE.Scene();

	let green = new THREE.Color(0xd9e69f);
	let white = new THREE.Color(0xd0d0d0);
	let black = new THREE.Color(0x232323);

	let height = window.innerHeight;
	// let width = (window.innerWidth / 5) * 4;
	let width = window.innerWidth;

	// Setting up a camera
	let camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 50);
	camera.position.z = 15;

	// Setting up the renderer. This will be called later to render scene with the camera setup above
	let renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	renderer.setClearColor(0xf4f4f4, 0);
	onMount(() => {
		container.appendChild(renderer.domElement);
	});

	// ---------------------------------------------------------------------------




	// ---------------------------------------------------------------------------

	// Setting up a group to hold the items we will be creating together
	let group = new THREE.Group();

	// Array curve holds the positions of points generated from a lorenz equation; lorenz function below generates the points and returns an array of points
	let arrayCurve = lorenz();

	// Generating the geometry
	let curve = new THREE.CatmullRomCurve3(arrayCurve);
	let vertices = curve.getPoints(100000);
	let geometry = new THREE.BufferGeometry().setFromPoints(vertices);

	// Generating a cloud of point
	let pcMat = new THREE.PointsMaterial();

	$: pcMat.color = $darkMode ? green : black;

	pcMat.transparent = true;
	pcMat.size = 0.02;
	// pcMat.blending = THREE.AdditiveBlending;
	pc = new THREE.Points(geometry, pcMat);
	pc.sizeAttenuation = true;
	pc.sortPoints = true;

	group.add(pc);

	scene.add(group);

	// {
	// 	const color = 0xfafafa;
	// 	const density = 0.03;
	// 	scene.fog = new THREE.FogExp2(color, density);
	// }

	group.rotation.y += Math.PI / 2;

	let step = 0;

	let render = function () {
		renderer.render(scene, camera);
		requestAnimationFrame(render);

		//Varying the points on each frame
		step += 0.00001;
		let count = 0;
		let geometry = pc.geometry;
		let a = 0.9 + Math.random() * 2;
		let b = 3.4 + Math.random() * 3;
		let f = 9.9 + Math.random() * 4;
		let g = 1 + Math.random();
		let t = 0.0001;

		// group.rotation.x += 0.001;
		// group.rotation.y += 0.001;
		// group.rotation.z += 0.001;

		// geometry.vertices.forEach(function (v) {
		// 	v.x = v.x - t * a * v.x + t * v.y * v.y - t * v.z * v.z + t * a * f;
		// 	v.y = v.y - t * v.y + t * v.x * v.y - t * b * v.x * v.z + t * g;
		// 	v.z = v.z - t * v.z + t * b * v.x * v.y + t * v.x * v.z;
		// });
		// geometry.verticesNeedUpdate = true;

		const positions = geometry.attributes.position.array;
		for (let i = 0; i < positions.length; i += 3) {
			let v = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
			positions[i] = v.x - t * a * v.x + t * v.y * v.y - t * v.z * v.z + t * a * f;
			positions[i + 1] = v.y - t * v.y + t * v.x * v.y - t * b * v.x * v.z + t * g;
			positions[i + 2] = v.z - t * v.z + t * b * v.x * v.y + t * v.x * v.z;
		}

		geometry.attributes.position.needsUpdate = true;

		// group.rotation.x += 0.001;
		// group.rotation.y += 0.001;
		// group.rotation.z += 0.001;
	};

	window.addEventListener(
		'resize',
		function () {
			let height = window.innerHeight;
			// let width = (window.innerWidth / 5) * 4;
			width = window.innerWidth;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		},
		false
	);

	render();

	function lorenz() {
		let arrayCurve = [];

		let x = 0.01,
			y = 0.01,
			z = 0.01;
		let a = 3.9;
		let b = 3.4;
		let f = 6;
		let g = 1;
		let t = 0.0003;
		for (let i = 0; i < 100000; i++) {
			let x1 = x;
			let y1 = y;
			let z1 = z;
			x = x - t * a * x + t * y * y - t * z * z + t * a * f;
			y = y - t * y + t * x * y - t * b * x * z + t * g;
			z = z - t * z + t * b * x * y + t * x * z;
			arrayCurve.push(new THREE.Vector3(x, y, z).multiplyScalar(2));
		}
		return arrayCurve;
	}
</script>

<div bind:this={container} class:geometry={true} />

<style>
	.geometry {
		overflow: hidden;
		opacity: 0.8;
		z-index: -10;
	}
</style>
