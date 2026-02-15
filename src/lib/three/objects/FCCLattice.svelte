<script>
	import * as THREE from 'three';

	export let scene;
	export let size = 3;
	export let scale = 2;
	export let color = 0x0000ff;
	export let opacity = 0.4;

	let group;
	let material;

	function generateFCCPoints() {
		const points = [];
		const a = scale;

		for (let i = -size; i <= size; i++) {
			for (let j = -size; j <= size; j++) {
				for (let k = -size; k <= size; k++) {
					const origin = new THREE.Vector3(i * a, j * a, k * a);

					if (i === -size || j === -size || k === -size) {
						points.push(origin.clone());
					}

					if (i < size) {
						points.push(new THREE.Vector3(origin.x + a/2, origin.y + a/2, origin.z));
						points.push(new THREE.Vector3(origin.x + a/2, origin.y, origin.z + a/2));
					}
					if (j < size) {
						points.push(new THREE.Vector3(origin.x, origin.y + a/2, origin.z + a/2));
					}
				}
			}
		}

		const unique = [];
		const seen = new Set();
		for (const p of points) {
			const key = `${p.x.toFixed(6)},${p.y.toFixed(6)},${p.z.toFixed(6)}`;
			if (!seen.has(key)) {
				seen.add(key);
				unique.push(p);
			}
		}

		return unique;
	}

	function generateNearestNeighborEdges(points) {
		const edges = [];
		const a = scale;
		const nnDist = a * Math.SQRT1_2;
		const tolerance = 0.01;

		for (let i = 0; i < points.length; i++) {
			for (let j = i + 1; j < points.length; j++) {
				const dist = points[i].distanceTo(points[j]);
				if (Math.abs(dist - nnDist) < tolerance) {
					edges.push([points[i], points[j]]);
				}
			}
		}

		return edges;
	}

	function create() {
		group = new THREE.Group();

		const points = generateFCCPoints();
		const edges = generateNearestNeighborEdges(points);

		material = new THREE.LineBasicMaterial({
			color,
			transparent: true,
			opacity
		});

		edges.forEach(([a, b]) => {
			const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
			group.add(new THREE.Line(geo, material));
		});

		scene.add(group);
	}

	export function init() {
		create();
	}

	export function updateOpacity(t) {
		if (material) material.opacity = t * opacity;
	}

	export function setPosition(x, y, z) {
		if (group) group.position.set(x, y, z);
	}

	export function dispose() {
		if (group) {
			scene.remove(group);
			group.traverse(obj => {
				if (obj.geometry) obj.geometry.dispose();
			});
			if (material) material.dispose();
			group = null;
			material = null;
		}
	}
</script>