<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  
	// Single initialization guard at module level
	let isInitialized = false;
  
	// Component state
	let canvasElement;
	let scene, camera, renderer, controls, lineSegments;
	let backgroundMesh;
	let worker;
	let animationFrameId;
  
	// Configuration state
	let frustumSize = 1.0;
	let rotating = true;
	let colorMode = "direction";
	let animationSpeed = 0.5;
	let latticeScale = 10.0;
	let phaseX = 0;
	let phaseY = 0;
	let phaseZ = 0;
	let rotateX = false;
	let rotateY = false;
	let rotateZ = false;
	let currentOpacity = 1.0;
	let cameraAnim = { 
	  active: false, 
	  start: new THREE.Vector3(), 
	  end: new THREE.Vector3(), 
	  t: 0 
	};
  
	// UI bindings
	let gridSize = 5;
	let speedValue = 0.5;
	let phaseXValue = 0;
	let phaseYValue = 0;
	let phaseZValue = 0;
	let latticeScaleValue = 10.0;
  
	// Display values
	let pointCount = '';
	let lineCount = '';
  
	// Constants
	const MAX_GRID = 10;
	const MAX_POINTS = MAX_GRID ** 3;
	const MAX_EDGES = (MAX_POINTS * (MAX_POINTS - 1)) / 2;

	// Worker code
	const workerCode = `
	self.onmessage = (msg) => {
		const { grid, colorMode, maxEdges, scale } = msg.data;

		const points = [];
		const step = (2 * scale) / (grid - 1);

		for (let i = 0; i < grid; i++)
		for (let j = 0; j < grid; j++)
			for (let k = 0; k < grid; k++) {
			const x = -scale + i * step;
			const y = -scale + j * step;
			const z = -scale + k * step;
			points.push([x, y, z]);
			}
	
		const positions = [];
		const colors = [];
	
		for (let i = 0; i < points.length; i++) {
		  const p1 = points[i];
		  for (let j = i + 1; j < points.length; j++) {
			const p2 = points[j];
	
			positions.push(p1[0], p1[1], p1[2]);
			positions.push(p2[0], p2[1], p2[2]);
	
			let r, g, b;
			if (colorMode === "direction") {
			  const dx = p2[0] - p1[0];
			  const dy = p2[1] - p1[1];
			  const dz = p2[2] - p1[2];
		  
			  const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
			  const nx = Math.abs(dx / len);
			  const ny = Math.abs(dy / len);
			  const nz = Math.abs(dz / len);
		  
			  r = nx * ny;
			  g = ny;
			  b = nz;
			} else {
			  r = 0.0;
			  g = 0.0;
			  b = 0.0;
			}
	
			colors.push(r, g, b);
			colors.push(r, g, b);
		  }
		}
	
		postMessage({ 
		  type: "done", 
		  count: positions.length / 3,
		  positions: new Float32Array(positions),
		  colors: new Float32Array(colors)
		});
	  };
	`;
  
	function setupWorker() {
	  const blob = new Blob([workerCode], { type: "application/javascript" });
	  worker = new Worker(URL.createObjectURL(blob));
  
	  worker.onmessage = (msg) => {
		const { count, positions, colors } = msg.data;
		updateGeometry(positions, colors, count);
		
		pointCount = `${gridSize}³ = ${gridSize ** 3} points`;
		lineCount = `${(count / 2).toLocaleString()} edges`;
	  };
	}
  
	function requestGraphBuild(grid) {
		worker.postMessage({ grid, colorMode, maxEdges: MAX_EDGES, scale: latticeScale });
	}

	function setupCamera() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspect = width / height;
		
		camera = new THREE.PerspectiveCamera(
			75,
			aspect,
			0.1,
			1000
		);
		camera.position.set(15, 15, 15);
		camera.lookAt(0, 0, 0);
	}
  
	function setupRenderer() {
	  renderer = new THREE.WebGLRenderer({ 
		canvas: canvasElement,
		antialias: true 
	  });
	  renderer.setSize(window.innerWidth, window.innerHeight);
	  renderer.setPixelRatio(window.devicePixelRatio);
	  renderer.autoClear = false;
	}
  
	function setupControls() {
	  controls = new OrbitControls(camera, canvasElement);
	  controls.enableDamping = true;
	  controls.dampingFactor = 0.05;
	  controls.screenSpacePanning = false;
	  controls.minDistance = 1;
	  controls.maxDistance = 50;
  
	  controls.addEventListener('start', () => {
		cameraAnim.active = false;
	  });
	}

	async function setupBackgroundShader() {
		try {
			const vertexResponse = await fetch('/shaders/vertex.glsl');
			const fragmentResponse = await fetch('/shaders/fragment.glsl');
			
			const vertexShader = await vertexResponse.text();
			const fragmentShader = await fragmentResponse.text();
			
			const textureLoader = new THREE.TextureLoader();
			const texture90s = await new Promise((resolve, reject) => {
				textureLoader.load('/90s_Illustration.jpg', resolve, undefined, reject);
			});
			
			const texture60s = await new Promise((resolve, reject) => {
				textureLoader.load('/60s_Illustration.jpg', resolve, undefined, reject);
			});
			
			const distance = 10;
			
			const planes = [
				{ 
					position: new THREE.Vector3(0, 0, distance),
					rotation: new THREE.Euler(0, 0, 0),
					timeOffset: 0,
					texture: texture90s
				},
				{ 
					position: new THREE.Vector3(0, 0, -distance),
					rotation: new THREE.Euler(0, Math.PI, 0),
					timeOffset: 1,
					texture: texture60s
				},
				{ 
					position: new THREE.Vector3(distance, 0, 0),
					rotation: new THREE.Euler(0, Math.PI / 2, 0),
					timeOffset: 2,
					texture: texture90s
				},
				{ 
					position: new THREE.Vector3(-distance, 0, 0),
					rotation: new THREE.Euler(0, -Math.PI / 2, 0),
					timeOffset: 3,
					texture: texture60s
				},
				{ 
					position: new THREE.Vector3(0, distance, 0),
					rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
					timeOffset: 4,
					texture: texture90s
				},
				{ 
					position: new THREE.Vector3(0, -distance, 0),
					rotation: new THREE.Euler(Math.PI / 2, 0, 0),
					timeOffset: 5,
					texture: texture60s
				}
			];
			
			backgroundMesh = [];
			
			planes.forEach((plane) => {
				const geometry = new THREE.PlaneGeometry(20, 20);
				
				let material;
				
				if (plane.texture) {
					material = new THREE.MeshBasicMaterial({
						map: plane.texture,
						side: THREE.DoubleSide,
						transparent: true,
						opacity: 0.8
					});
				} else {
					material = new THREE.ShaderMaterial({
						uniforms: {
							time: { value: plane.timeOffset },
							resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
						},
						vertexShader: vertexShader,
						fragmentShader: fragmentShader,
						depthTest: false,
						depthWrite: false,
						side: THREE.DoubleSide
					});
				}
				
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.copy(plane.position);
				mesh.rotation.copy(plane.rotation);
				
				scene.add(mesh);
				backgroundMesh.push(mesh);
			});
			
		} catch (error) {
			console.error('Error loading shaders or textures:', error);
			scene.background = new THREE.Color(0x000000);
		}
	}

	function animateCameraTo(target) {
	  cameraAnim.start.copy(camera.position);
	  cameraAnim.end.copy(target);
	  cameraAnim.t = 0;
	  cameraAnim.active = true;
	}
  
	function updateGeometry(positions, colors, vertexCount) {
	  if (lineSegments) {
		scene.remove(lineSegments);
		lineSegments.geometry.dispose();
		lineSegments.material.dispose();
	  }
  
	  const geometry = new THREE.BufferGeometry();
	  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
	  const material = new THREE.LineBasicMaterial({
		vertexColors: true,
		transparent: true,
		opacity: currentOpacity
	  });
  
	  lineSegments = new THREE.LineSegments(geometry, material);
	  scene.add(lineSegments);
	}
  
	function animate() {
	  animationFrameId = requestAnimationFrame(animate);
  
	  if (!cameraAnim.active) cameraAnim.t = 1;
  
	  if (cameraAnim.active) {
		cameraAnim.t += 0.005 * animationSpeed;
		camera.position.lerpVectors(cameraAnim.start, cameraAnim.end, cameraAnim.t);
		camera.lookAt(0, 0, 0);
		if (cameraAnim.t >= 1) cameraAnim.active = false;
	  }
  
	  if (rotating && lineSegments) {
		const delta = 0.0005 * animationSpeed;
		
		if (rotateX) {
		  lineSegments.rotation.x += delta;
		  phaseX = lineSegments.rotation.x;
		  phaseXValue = phaseX / Math.PI;
		}
		
		if (rotateY) {
		  lineSegments.rotation.y += delta;
		  phaseY = lineSegments.rotation.y;
		  phaseYValue = phaseY / Math.PI;
		}
		
		if (rotateZ) {
		  lineSegments.rotation.z += delta;
		  phaseZ = lineSegments.rotation.z;
		  phaseZValue = phaseZ / Math.PI;
		}
	  }
	
	  controls.update();
	  renderer.clear();
	  renderer.render(scene, camera);
	}

	function handleResize() {
		const aspect = window.innerWidth / window.innerHeight;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		
		if (backgroundMesh && Array.isArray(backgroundMesh)) {
			backgroundMesh.forEach(mesh => {
				if (mesh.material.uniforms) {
					mesh.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
				}
			});
		}
	}
  
	// UI handlers
	function handleGridChange() {
	  requestGraphBuild(gridSize);
	}
  
	function handleSpeedChange() {
	  animationSpeed = speedValue;
	}

	function handleScaleChange() {
		latticeScale = latticeScaleValue;
		requestGraphBuild(gridSize);
	}
  
	function handlePhaseXChange() {
	  phaseX = phaseXValue * Math.PI;
	  if (lineSegments) lineSegments.rotation.x = phaseX;
	}
  
	function handlePhaseYChange() {
	  phaseY = phaseYValue * Math.PI;
	  if (lineSegments) lineSegments.rotation.y = phaseY;
	}
  
	function handlePhaseZChange() {
	  phaseZ = phaseZValue * Math.PI;
	  if (lineSegments) lineSegments.rotation.z = phaseZ;
	}
  
	function toggleRotation() {
	  rotating = !rotating;
	}
  
	function toggleColorMode() {
	  colorMode = colorMode === "uniform" ? "direction" : "uniform";
	  requestGraphBuild(gridSize);
	}
  
	function toggleOpacity() {
	  currentOpacity = currentOpacity === 0.5 ? 1.0 : 0.5;
	  if (lineSegments) lineSegments.material.opacity = currentOpacity;
	}
  
	function resetToIso() {
	  cameraAnim.active = false;
	  if (lineSegments) {
		lineSegments.rotation.set(0, 0, 0);
		phaseX = phaseY = phaseZ = 0;
		phaseXValue = phaseYValue = phaseZValue = 0;
	  }
	  const r = camera.position.length();
	  const iso = new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(r);
	  camera.position.copy(iso);
	  camera.up.set(0, 0, 1);
	  camera.lookAt(0, 0, 0);
	  controls.update();
	}
  
	function resetToXY() {
	  cameraAnim.active = false;
	  if (lineSegments) {
		lineSegments.rotation.set(0, 0, 0);
		phaseX = phaseY = phaseZ = 0;
		phaseXValue = phaseYValue = phaseZValue = 0;
	  }
	  animateCameraTo(new THREE.Vector3(0, 0, 10));
	}
  
	function resetToXZ() {
	  cameraAnim.active = false;
	  if (lineSegments) {
		lineSegments.rotation.set(0, 0, 0);
		phaseX = phaseY = phaseZ = 0;
		phaseXValue = phaseYValue = phaseZValue = 0;
	  }
	  animateCameraTo(new THREE.Vector3(0, 10, 0));
	}
  
	onMount(async () => {
	  if (isInitialized) {
		console.error('Component already initialized! Check your app for duplicate components.');
		return;
	  }
	  
	  if (!canvasElement) {
		console.error('Canvas element not available');
		return;
	  }
  
	  isInitialized = true;
  
	  scene = new THREE.Scene();
  
	  setupWorker();
	  setupCamera();
	  setupRenderer();
	  setupControls();
	  await setupBackgroundShader();
	  requestGraphBuild(gridSize);
	  animate();
  
	  window.addEventListener('resize', handleResize);
  
	  return () => {
		isInitialized = false;
		window.removeEventListener('resize', handleResize);
		
		if (animationFrameId) cancelAnimationFrame(animationFrameId);
		if (worker) worker.terminate();
		if (lineSegments) {
		  scene.remove(lineSegments);
		  lineSegments.geometry.dispose();
		  lineSegments.material.dispose();
		}
		if (backgroundMesh) {
			if (Array.isArray(backgroundMesh)) {
				backgroundMesh.forEach(mesh => {
					scene.remove(mesh);
					mesh.geometry.dispose();
					mesh.material.dispose();
				});
			} else {
				scene.remove(backgroundMesh);
				backgroundMesh.geometry.dispose();
				backgroundMesh.material.dispose();
			}
		}
		if (renderer) renderer.dispose();
		if (controls) controls.dispose();
	  };
	});
</script>
  
<canvas bind:this={canvasElement} class="webgl-canvas"></canvas>

<div class="info-box">
	<p><strong>LATTICE ARCHIVE</strong></p>
	<p>Spec(ℤ): The spectrum of a point {'{•}'}</p>
	<p>An nD affine Non-Noetherian scheme; the view from the archimedean place.</p>
	<p>{pointCount}</p>
	<p>{lineCount}</p>
</div>

<div class="ui-panel">
	<div class="row">
		Grid:
		<input 
			type="range" 
			bind:value={gridSize} 
			on:input={handleGridChange}
			min="2" 
			max="10" 
			step="1"
		/>
		<span>{gridSize}</span>
	</div>

	<div class="row">
		Speed:
		<input 
			type="range" 
			bind:value={speedValue} 
			on:input={handleSpeedChange}
			min="0.1" 
			max="1" 
			step="0.1"
		/>
		<span>{speedValue.toFixed(1)}</span>
	</div>

	<div class="row">
		Scale:
		<input 
			type="range" 
			bind:value={latticeScaleValue} 
			on:input={handleScaleChange}
			min="0.1" 
			max="10" 
			step="0.1"
		/>
		<span>{latticeScaleValue.toFixed(1)}</span>
	</div>

	<div class="row">
		Phase X:
		<input 
			type="range" 
			bind:value={phaseXValue} 
			on:input={handlePhaseXChange}
			min="0" 
			max="2" 
			step="0.01"
		/>
		<span>{phaseXValue.toFixed(2)}π</span>
	</div>

	<div class="row">
		Phase Y:
		<input 
			type="range" 
			bind:value={phaseYValue} 
			on:input={handlePhaseYChange}
			min="0" 
			max="2" 
			step="0.01"
		/>
		<span>{phaseYValue.toFixed(2)}π</span>
	</div>

	<div class="row">
		Phase Z:
		<input 
			type="range" 
			bind:value={phaseZValue} 
			on:input={handlePhaseZChange}
			min="0" 
			max="2" 
			step="0.01"
		/>
		<span>{phaseZValue.toFixed(2)}π</span>
	</div>

	<div class="row">
		<button on:click={toggleRotation}>Rotate</button>
		<label>
			<input type="checkbox" bind:checked={rotateX} />
			X
		</label>
		<label>
			<input type="checkbox" bind:checked={rotateY} />
			Y
		</label>
		<label>
			<input type="checkbox" bind:checked={rotateZ} />
			Z
		</label>
	</div>

	<div class="row">
		<button on:click={toggleColorMode}>
			Color: {colorMode}
		</button>
		<button on:click={toggleOpacity}>Opacity</button>
	</div>

	<div class="row">
		<button on:click={resetToIso}>Iso</button>
		<button on:click={resetToXY}>XY</button>
		<button on:click={resetToXZ}>XZ</button>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
		background: black;
		font-family: "Courier New", monospace;
		font-size: 12px;
	}

	.webgl-canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: block;
	}

	.info-box {
		position: fixed;
		top: 20px;
		left: 20px;
		background: rgba(0, 0, 0, 0.65);
		color: white;
		font-size: 12px;
		padding: 10px 12px;
		border-radius: 6px;
		max-width: 260px;
		pointer-events: none;
		line-height: 1.35em;
		z-index: 100;
	}

	.info-box p {
		margin: 0 0 0.5em 0;
	}

	.info-box p:last-child {
		margin-bottom: 0;
	}

	.ui-panel {
		position: fixed;
		top: 20px;
		right: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 100;
	}

	.row {
		background: rgba(0, 0, 0, 0.7);
		padding: 10px;
		border-radius: 4px;
		color: white;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	button {
		padding: 6px 10px;
		background: rgba(40, 40, 40, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: white;
		border-radius: 4px;
		cursor: pointer;
		transition: 0.2s;
	}

	button:hover {
		background: rgba(70, 70, 70, 0.9);
		border-color: rgba(255, 255, 255, 0.5);
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 120px;
		background: transparent;
	}

	input[type="range"]::-webkit-slider-runnable-track {
		height: 2px;
		background: rgba(255, 255, 255, 0.35);
		border-radius: 2px;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 10px;
		width: 10px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		margin-top: -4px;
		box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
	}

	input[type="range"]::-moz-range-track {
		height: 2px;
		background: rgba(255, 255, 255, 0.35);
		border-radius: 2px;
	}

	input[type="range"]::-moz-range-thumb {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		border: none;
		box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
	}

	input[type="range"]:focus {
		outline: none;
	}

	input[type="checkbox"] {
		margin: 0 4px 0 8px;
		cursor: pointer;
	}

	label {
		display: inline-flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}
</style>