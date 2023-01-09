<script>
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	import { screenType, userType, mouseOnLink } from '$lib/store/store';

	let container;
	let id;
	onDestroy(() => cancelAnimationFrame(id));

	let camera, scene, renderer;
	let plane;
	let pointer,
		raycaster,
		isShiftDown = false;

	let rollOverMesh, rollOverMaterial;
	let cubeGeo, cubeMaterial;

	let width = screen.width;
	let height = screen.height;

	let d;
	if ($screenType == 2) {
		d = 2;
	} else {
		d = 4;
	}

	const objects = [];

	init();
	render();

	function init() {
		camera = new THREE.OrthographicCamera(width / -d, width / d, height / d, height / -d, 10, 3200);
		camera.position.set(1000, 1000, 1000);
		camera.lookAt(0, 0, 0);
		camera.zoom = 5;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x232323);

		// roll-over helpers

		const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
		rollOverMaterial = new THREE.MeshBasicMaterial({
			color: 0xf2cd5e,
			opacity: 0.4,
			transparent: true
		});
		rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
		rollOverMesh.position.y = 1000; // really high to hide it initally and on mobile
		scene.add(rollOverMesh);

		// cubes

		cubeGeo = new THREE.BoxGeometry(50, 50, 50);
		cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xf2cd5e });

		// grid

		const gridHelper = new THREE.GridHelper(2000, 40, 0x424242, 0x424242);
		scene.add(gridHelper);

		//

		raycaster = new THREE.Raycaster();
		pointer = new THREE.Vector2();

		const geometry = new THREE.PlaneGeometry(1000, 1000);
		geometry.rotateX(-Math.PI / 2);

		plane = new THREE.Mesh(
			geometry,
			new THREE.MeshBasicMaterial({ color: 0xe0e0e0, visible: false })
		);
		scene.add(plane);

		objects.push(plane);

		// lights

		const ambientLight = new THREE.AmbientLight(0x606060);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		scene.add(directionalLight);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);

		onMount(() => {
			container.appendChild(renderer.domElement);

			document.addEventListener('pointermove', onPointerMove);
			document.addEventListener('pointerdown', onPointerDown);
			document.addEventListener('keydown', onDocumentKeyDown);
			document.addEventListener('keyup', onDocumentKeyUp);
		});

		//
	}

	function onPointerMove(event) {
		pointer.set(((event.clientX - 0) / width) * 2 - 1, -(event.clientY / height) * 2 + 1);

		raycaster.setFromCamera(pointer, camera);

		const intersects = raycaster.intersectObjects(objects, false);

		if (intersects.length > 0) {
			const intersect = intersects[0];

			rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
			rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

			render();
		}
	}

	function onPointerDown(event) {
		if (!$mouseOnLink) {
			pointer.set(((event.clientX - 0) / width) * 2 - 1, -(event.clientY / height) * 2 + 1);

			raycaster.setFromCamera(pointer, camera);

			const intersects = raycaster.intersectObjects(objects, false);

			if (intersects.length > 0) {
				const intersect = intersects[0];

				// delete cube

				if (isShiftDown) {
					if (intersect.object !== plane) {
						scene.remove(intersect.object);

						objects.splice(objects.indexOf(intersect.object), 1);
					}

					// create cube
				} else {
					const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
					voxel.position.copy(intersect.point).add(intersect.face.normal);
					voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
					scene.add(voxel);

					objects.push(voxel);
				}

				render();
			}
		}
	}

	function onDocumentKeyDown(event) {
		switch (event.keyCode) {
			case 16:
				isShiftDown = true;
				break;
		}
	}

	function onDocumentKeyUp(event) {
		switch (event.keyCode) {
			case 16:
				isShiftDown = false;
				break;
		}
	}

	function render() {
		renderer.render(scene, camera);
	}
</script>

<div bind:this={container} class:geometry={true} />

<style>
	.geometry {
		touch-action: manipulation;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -10;
	}
</style>
