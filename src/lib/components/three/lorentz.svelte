<script>
	import { onMount, onDestroy } from 'svelte';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
	import * as THREE from 'three';

	let container, pc, id;
	onDestroy(() => cancelAnimationFrame(id));

	// Setting up the scene
	let scene = new THREE.Scene();

	let height = window.innerHeight;
	let width = window.innerWidth;

	// Setting up a camera
	let camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 800);
	camera.position.z = 100;

	// Setting up the renderer. This will be called later to render scene with the camera setup above
	let renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(width, height);
	renderer.setClearColor(0xd0d0d0, 0);
	onMount(() => {
		container.appendChild(renderer.domElement);
	});

	let controls = new OrbitControls(camera, renderer.domElement);
	controls.maxDistance = 250;
	controls.minDistance = 50;
	controls.enablePan = false;

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
	pcMat.color = new THREE.Color(0x232323);
	pcMat.transparent = true;
	pcMat.size = 0.1;
	pcMat.blending = THREE.AdditiveBlending;
	pc = new THREE.Points(geometry, pcMat);
	pc.sizeAttenuation = true;
	pc.sortPoints = true;

	group.add(pc);

	scene.add(group);

	group.rotation.y += Math.PI / 2;

	let step = 0;

	let render = function () {
		renderer.render(scene, camera);
		id = requestAnimationFrame(render);

		//Varying the points on each frame
		step += 0.00001;
		// console.log(step);
		let geometry = pc.geometry;
		let a = 0.9 + Math.random() * 7;
		let b = 3.4 + Math.random() * 8;
		let f = 9.9 + Math.random() * 9;
		let g = 1 + Math.random();
		let t = 0.0001;

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

		group.rotation.x += 0.002;
		group.rotation.y += 0.002;
		group.rotation.z += 0.002;
	};

	window.addEventListener(
		'resize',
		function () {
			let height = window.innerHeight;
			let width = window.innerWidth;
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
		let a = 4.9;
		let b = 5.4;
		let f = 7.9;
		let g = 1;
		let t = 0.0006;
		for (let i = 0; i < 100000; i++) {
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
		position: fixed;
		top: 0;
		left: 0;
		overflow: hidden;
	}
</style>
