<script>
	import { tick } from 'svelte';
	import * as THREE from 'three';
	import GoldenRectangleSchematic from './GoldenRectangleSchematic.svelte';

	export let scene;
	export let axis;
	export let direction;
	export let vertices;
	export let indices;

	const PHI = (1 + Math.sqrt(5)) / 2;

	let rectangleGroup;
	let traceLines = [];
	let schematicComponent;
	let basis = null;
	let initialized = false;

	let fillMaterial;
	let outlineMaterial;
	let spiralMaterial;
	let subdivisionMaterials = [];
	let traceLineMaterials = [];

	function getRectCorners() {
		return indices.map(i => new THREE.Vector3(...vertices[i]));
	}

	function getRectBasis() {
		const corners = getRectCorners();
		const edge1 = new THREE.Vector3().subVectors(corners[1], corners[0]);
		const edge2 = new THREE.Vector3().subVectors(corners[3], corners[0]);
		
		const len1 = edge1.length();
		const len2 = edge2.length();
		
		let uAxis, vAxis, uLen, vLen;
		if (len1 < len2) {
			uAxis = edge1.clone().normalize();
			vAxis = edge2.clone().normalize();
			uLen = len1;
			vLen = len2;
		} else {
			uAxis = edge2.clone().normalize();
			vAxis = edge1.clone().normalize();
			uLen = len2;
			vLen = len1;
		}
		
		const center = new THREE.Vector3()
			.add(corners[0]).add(corners[1]).add(corners[2]).add(corners[3])
			.multiplyScalar(0.25);
		
		return { center, uAxis, vAxis, uLen, vLen, corners };
	}

	function localToWorld(u, v) {
		return basis.center.clone()
			.add(basis.uAxis.clone().multiplyScalar(-u))
			.add(basis.vAxis.clone().multiplyScalar(v));
	}

	function computeGoldenRectangleData() {
		const squares = [];
		const arcCenters = [];
		
		let rect = {
			left: -basis.uLen / 2,
			right: basis.uLen / 2,
			bottom: -basis.vLen / 2,
			top: basis.vLen / 2
		};
		
		for (let i = 0; i < 10; i++) {
			const w = rect.right - rect.left;
			const h = rect.top - rect.bottom;
			if (w < 0.001 || h < 0.001) break;

			const side = Math.min(w, h);
			let square, arc;

			switch (i % 4) {
				case 0:
					square = { left: rect.left, right: rect.left + side, bottom: rect.bottom, top: rect.bottom + side };
					arc = { u: rect.left + side, v: rect.bottom + side, startAngle: Math.PI, dir: 0 };
					rect.bottom += side; 
					break;
				case 1:
					square = { left: rect.left, right: rect.left + side, bottom: rect.top - side, top: rect.top };
					arc = { u: rect.left + side, v: rect.top - side, startAngle: Math.PI * 0.5, dir: 1 };
					rect.left += side;
					break;
				case 2:
					square = { left: rect.right - side, right: rect.right, bottom: rect.top - side, top: rect.top };
					arc = { u: rect.right - side, v: rect.top - side, startAngle: 0, dir: 2 };
					rect.top -= side;
					break;
				case 3:
					square = { left: rect.right - side, right: rect.right, bottom: rect.bottom, top: rect.bottom + side };
					arc = { u: rect.right - side, v: rect.bottom + side, startAngle: Math.PI * 1.5, dir: 3 };
					rect.right -= side;
					break;
			}

			squares.push(square);
			arcCenters.push({ ...arc, radius: side });
		}
		
		return { squares, arcCenters };
	}

	function createGoldenSpiral(arcCenters) {
		const group = new THREE.Group();
		const pointsPerArc = 32;

		spiralMaterial = new THREE.LineBasicMaterial({
			color: 0x0000ff,
			transparent: true,
			opacity: 0
		});

		for (let i = 0; i < arcCenters.length; i++) {
			const arc = arcCenters[i];
			const arcPoints = [];

			for (let j = 0; j <= pointsPerArc; j++) {
				const t = j / pointsPerArc;
				const angle = arc.startAngle + t * (Math.PI / 2);
				const u = arc.u + arc.radius * Math.cos(angle);
				const v = arc.v + arc.radius * Math.sin(angle);
				arcPoints.push(localToWorld(u, v));
			}

			const geo = new THREE.BufferGeometry().setFromPoints(arcPoints);
			group.add(new THREE.Line(geo, spiralMaterial));
		}

		return group;
	}

	function createSubdivisionLines(squares) {
		const group = new THREE.Group();
		subdivisionMaterials = [];
		
		for (let i = 0; i < Math.min(8, squares.length); i++) {
			const sq = squares[i];
			const corners = [
				localToWorld(sq.left, sq.bottom),
				localToWorld(sq.right, sq.bottom),
				localToWorld(sq.right, sq.top),
				localToWorld(sq.left, sq.top)
			];
			
			const geo = new THREE.BufferGeometry().setFromPoints([
				corners[0], corners[1],
				corners[1], corners[2],
				corners[2], corners[3],
				corners[3], corners[0]
			]);
			
			const mat = new THREE.LineBasicMaterial({ 
				color: 0x0000ff, 
				transparent: true, 
				opacity: 0
			});
			subdivisionMaterials.push({ mat });
			group.add(new THREE.LineSegments(geo, mat));
		}

		return group;
	}

	function createRectangle() {
		const group = new THREE.Group();
		const corners = getRectCorners();

		fillMaterial = new THREE.MeshBasicMaterial({
			color: 0x232323,
			transparent: true,
			opacity: 0,
			side: THREE.DoubleSide,
			depthWrite: false
		});
		
		const shape = new THREE.BufferGeometry().setFromPoints([
			corners[0], corners[1], corners[2],
			corners[0], corners[2], corners[3]
		]);
		group.add(new THREE.Mesh(shape, fillMaterial));

		outlineMaterial = new THREE.LineBasicMaterial({ 
			color: 0x0000ff, 
			transparent: true, 
			opacity: 0 
		});
		
		const outline = new THREE.BufferGeometry().setFromPoints([
			corners[0], corners[1],
			corners[1], corners[2],
			corners[2], corners[3],
			corners[3], corners[0]
		]);
		group.add(new THREE.LineSegments(outline, outlineMaterial));

		const { squares, arcCenters } = computeGoldenRectangleData();
		
		group.add(createGoldenSpiral(arcCenters));
		group.add(createSubdivisionLines(squares));

		return group;
	}

	function createTraceLines() {
		const lines = [];
		traceLineMaterials = [];
		
		indices.forEach(i => {
			const startPos = new THREE.Vector3(...vertices[i]);
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute([
				startPos.x, startPos.y, startPos.z,
				startPos.x, startPos.y, startPos.z
			], 3));

			const material = new THREE.LineDashedMaterial({
				color: 0x0000ff,
				transparent: true,
				opacity: 0,
				dashSize: 0.1,
				gapSize: 0.05
			});
			traceLineMaterials.push(material);

			const line = new THREE.Line(geometry, material);
			line.computeLineDistances();
			line.userData.startPos = startPos.clone();
			scene.add(line);
			lines.push(line);
		});
		
		return lines;
	}

	function updateOpacities(t) {
		const opacity = t;
		
		if (fillMaterial) fillMaterial.opacity = opacity * 0.0;
		if (outlineMaterial) outlineMaterial.opacity = opacity;
		if (spiralMaterial) spiralMaterial.opacity = opacity;
		
		subdivisionMaterials.forEach(({ mat }) => {
			mat.opacity = opacity * 0.5;
		});
		
		traceLineMaterials.forEach(mat => {
			mat.opacity = opacity * 0.5;
		});
	}

	export async function init() {
		basis = getRectBasis();
		
		rectangleGroup = createRectangle();
		scene.add(rectangleGroup);

		traceLines = createTraceLines();

		await tick();
		
		if (schematicComponent) {
			schematicComponent.init();
		}

		initialized = true;
	}

	export function updateProjection(projection) {
		if (!rectangleGroup || !initialized) return;

		const paneDist = projection * 3.5;
		const schematicDist = projection * 7;

		const offset = axis.clone().multiplyScalar(paneDist * direction);
		rectangleGroup.position.copy(offset);

		updateOpacities(projection);

		traceLines.forEach(line => {
			const { startPos } = line.userData;
			const endPos = startPos.clone().add(axis.clone().multiplyScalar(schematicDist * direction));
			
			const positions = line.geometry.attributes.position.array;
			positions[3] = endPos.x;
			positions[4] = endPos.y;
			positions[5] = endPos.z;
			line.geometry.attributes.position.needsUpdate = true;
			line.computeLineDistances();
		});

		if (schematicComponent && schematicComponent.updateProjection) {
			schematicComponent.updateProjection(projection, schematicDist);
		}
	}

	export function dispose() {
		if (rectangleGroup) {
			scene.remove(rectangleGroup);
			rectangleGroup.traverse(obj => {
				if (obj.geometry) obj.geometry.dispose();
				if (obj.material) obj.material.dispose();
			});
		}
		traceLines.forEach(line => {
			scene.remove(line);
			line.geometry.dispose();
			line.material.dispose();
		});
		if (schematicComponent && schematicComponent.dispose) {
			schematicComponent.dispose();
		}
	}
</script>

{#if basis}
	<GoldenRectangleSchematic
		bind:this={schematicComponent}
		{scene}
		{basis}
		{axis}
		{direction}
	/>
{/if}