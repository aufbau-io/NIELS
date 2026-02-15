<script>
	import * as THREE from 'three';

	export let scene;
	export let size = 3;
	export let scale = 2;
	export let color = 0x0000ff;
	export let opacity = 0.4;

	let mesh;
	let material;

	// FCC nearest neighbor offsets (in units of a/2)
	// Each atom connects to 12 neighbors at distance a/√2
	const nnOffsets = [
		[1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
		[1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
		[0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]
	];

	// FCC basis: corner + 3 face centers
	const basis = [
		[0, 0, 0],
		[0.5, 0.5, 0],
		[0.5, 0, 0.5],
		[0, 0.5, 0.5]
	];

	function create() {
		const a = scale;
		const half = a / 2;
		const positions = [];

		// For each unit cell
		for (let i = -size; i < size; i++) {
			for (let j = -size; j < size; j++) {
				for (let k = -size; k < size; k++) {
					// For each basis atom
					for (const [bx, by, bz] of basis) {
						const x = (i + bx) * a;
						const y = (j + by) * a;
						const z = (k + bz) * a;

						// Add edges to forward neighbors only (avoid duplicates)
						for (const [dx, dy, dz] of nnOffsets) {
							const nx = x + dx * half;
							const ny = y + dy * half;
							const nz = z + dz * half;

							// Only add if neighbor is "ahead" (avoids drawing twice)
							if (dx > 0 || (dx === 0 && dy > 0) || (dx === 0 && dy === 0 && dz > 0)) {
								// Check bounds
								if (Math.abs(nx) <= size * a && Math.abs(ny) <= size * a && Math.abs(nz) <= size * a) {
									positions.push(x, y, z, nx, ny, nz);
								}
							}
						}
					}
				}
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

		material = new THREE.LineBasicMaterial({
			color,
			transparent: true,
			opacity,
			depthWrite: false
		});

		mesh = new THREE.LineSegments(geometry, material);
		scene.add(mesh);
	}

	export function init() {
		create();
	}

	export function updateOpacity(t) {
		if (material) material.opacity = t * opacity;
	}

	export function setPosition(x, y, z) {
		if (mesh) mesh.position.set(x, y, z);
	}

	export function dispose() {
		if (mesh) {
			scene.remove(mesh);
			mesh.geometry.dispose();
			material.dispose();
			mesh = null;
			material = null;
		}
	}
</script>