<script>
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import gsap from "gsap";
	// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


	import { screenType, darkMode } from '$lib/store/store';

	let container;
	let id;
	onDestroy(() => cancelAnimationFrame(id));

	let m = { x: 0, y: 0 };

	let camera, scene, renderer;
	let plane;
	let pointer,
		raycaster = false;

	let mixer;

	let gridHelper;

	let rollOverMesh, rollOverMaterial;
	let cubeGeo, cubeMaterial;

	let width = screen.width;
	let height = screen.height;
	let mouseGroup;

	let d;
	if ($screenType == 2) {
		d = 2;
	} else {
		d = 4;
	}

	let white = new THREE.Color(0xf0f0f0);
	let black = new THREE.Color(0x232323);

	// $: backgroundColor = $darkMode ? 0xff0000 : 0x232323;
	// let backgroundColor = 0x0000000

	const objects = [];

	function init() {
		camera = new THREE.OrthographicCamera(width / -d, width / d, height / d, height / -d, 10, 3200);
		camera.position.set(1000, 1000, 1000);
		camera.lookAt(0, 0, 0);
		camera.zoom = 5;

		scene = new THREE.Scene();
		scene.background = $darkMode ? black : white;
		// renderer.setClearColor(0xd0d0d0, 0);

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

		gridHelper = new THREE.GridHelper(2000, 40, 0x424242, 0x424242);
		scene.add(gridHelper);



		// mouse

		mouseGroup = new THREE.Group();

		const gltfLoader = new GLTFLoader();
		gltfLoader.load('/mouse_basic_anim_running.glb', (glb) => {
			let mouse = glb.scene;
			// mouse.position.x = 0;
			// mouse.position.z = 0;

			// mewtwo.material = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });

			mouse.scale.set(10, 10, 10);
			mouseGroup.add(mouse);

			mixer = new THREE.AnimationMixer(glb.scene)
        const action = mixer.clipAction(glb.animations[0])
        action.play()
		});

		scene.add(mouseGroup);
		

		//  stuff idk

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

			document.addEventListener('pointermove', handleMousemove);
			// document.addEventListener('pointerdown', onPointerDown);
			//document.addEventListener('keydown', onDocumentKeyDown);
			// document.addEventListener('keyup', onDocumentKeyUp);
		});

		//
	}

	// clock
	const clock = new THREE.Clock();

	// Animations
	const tick = () => {
		// time
		//   const currentTime = Date.now();
		//   const deltaTime = currentTime - time;
		//   time = currentTime;

		// clock
		var delta = clock.getDelta();

	
		// gsap.to(gridHelper.position, { duration: 1, delay: 0, z: gridHelper.position.z -30 });

		// update objects
		//   mesh.rotation.y = Math.sin(elapsedTime);
		//   mesh.rotation.x = Math.cos(elapsedTime);

		mouseGroup.position.x = m.x
		mouseGroup.position.z = m.y
		// camera.position.x = Math.cos(elapsedTime);
		// camera.lookAt(mesh.position);


  
  	if ( mixer ) mixer.update( delta );

		// render
		renderer.render(scene, camera);

		//
		window.requestAnimationFrame(tick);
	};

	
	init();
	tick();

	function handleMousemove(event) {
		m.x = event.clientX / 10;
		m.y = event.clientY / 10;
	}

	// function onPointerMove(event) {
	// 	pointer.set(((event.clientX - 0) / width) * 2 - 1, -(event.clientY / height) * 2 + 1);

	// 	raycaster.setFromCamera(pointer, camera);

	// 	// mouseGroup.position.x = ((event.clientX - 0) / width) * 2 - 1;
	// 	// mouseGroup.position.z = 100;

	// 	render();

	// }

	// function onPointerDown(event) {
	// 	if (!$mouseOnLink) {
	// 		pointer.set(((event.clientX - 0) / width) * 2 - 1, -(event.clientY / height) * 2 + 1);

	// 		raycaster.setFromCamera(pointer, camera);

	// 		// const intersects = raycaster.intersectObjects(objects, false);

	// 		if (intersects.length > 0) {
	// 			const intersect = intersects[0];

	// 			// delete cube

	// 			if (isShiftDown) {
	// 				if (intersect.object !== plane) {
	// 					scene.remove(intersect.object);

	// 					objects.splice(objects.indexOf(intersect.object), 1);
	// 				}

	// 				// create cube
	// 			} else {
	// 				const voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
	// 				voxel.position.copy(intersect.point).add(intersect.face.normal);
	// 				voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
	// 				scene.add(voxel);

	// 				objects.push(voxel);
	// 			}

	// 			render();
	// 		}
	// 	}
	// }

	// function render() {
	// 	renderer.render(scene, camera);
	// }
</script>

<div bind:this={container} class:geometry={true} />

<style>
	.geometry {
		touch-action: manipulation;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		max-width: 100%;
		max-height: 100%;
		z-index: -10;
	}
</style>
