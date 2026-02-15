<script>
	import * as THREE from 'three';

	export let scene;
	export let basis;
	export let axis;
	export let direction;

	const PHI = (1 + Math.sqrt(5)) / 2;

	let group;
	let materials = [];
	let initialized = false;

	function localToWorld(u, v) {
		return basis.center.clone()
			.add(basis.uAxis.clone().multiplyScalar(u))
			.add(basis.vAxis.clone().multiplyScalar(v));
	}

	function addLine(points, baseOpacity, dashed = false) {
		const geo = new THREE.BufferGeometry().setFromPoints(points);
		const mat = dashed 
			? new THREE.LineDashedMaterial({ 
				color: 0xf0f0f0, 
				transparent: true, 
				opacity: 0,
				dashSize: 0.08,
				gapSize: 0.04
			})
			: new THREE.LineBasicMaterial({ 
				color: 0xf0f0f0, 
				transparent: true, 
				opacity: 0 
			});
		
		materials.push({ mat, baseOpacity });
		
		const line = dashed ? new THREE.Line(geo, mat) : new THREE.LineSegments(geo, mat);
		if (dashed) line.computeLineDistances();
		group.add(line);
	}

	function create() {
		if (!basis || !scene) return;

		group = new THREE.Group();
		materials = [];

		const halfU = basis.uLen / 2;
		const halfV = basis.vLen / 2;

		const uIsShort = basis.uLen <= basis.vLen;
		const S = Math.min(basis.uLen, basis.vLen);

		const tickLen = S * 0.08;
		const dimOffset = S * 0.25;

		const corners = [
			localToWorld(-halfU, -halfV),
			localToWorld( halfU, -halfV),
			localToWorld( halfU,  halfV),
			localToWorld(-halfU,  halfV)
		];

		// Outline
		addLine([
			corners[0], corners[1],
			corners[1], corners[2],
			corners[2], corners[3],
			corners[3], corners[0]
		], 0.5);

		// φ division line
		if (uIsShort) {
			addLine([
				localToWorld(-halfU, -halfV + S),
				localToWorld(halfU, -halfV + S)
			], 0.3);
		} else {
			addLine([
				localToWorld(-halfU + S, -halfV),
				localToWorld(-halfU + S, halfV)
			], 0.3);
		}

		// Dimension lines
		if (uIsShort) {
			const shortStart = localToWorld(-halfU, -halfV - dimOffset);
			const shortEnd = localToWorld(halfU, -halfV - dimOffset);
			addLine([shortStart, shortEnd], 0.35);

			addLine([
				shortStart.clone().add(basis.uAxis.clone().multiplyScalar(-tickLen)),
				shortStart.clone().add(basis.uAxis.clone().multiplyScalar(tickLen))
			], 0.35);
			addLine([
				shortEnd.clone().add(basis.uAxis.clone().multiplyScalar(-tickLen)),
				shortEnd.clone().add(basis.uAxis.clone().multiplyScalar(tickLen))
			], 0.35);

			const longStart = localToWorld(halfU + dimOffset, -halfV);
			const longEnd = localToWorld(halfU + dimOffset, halfV);
			addLine([longStart, longEnd], 0.35);

			addLine([
				longStart.clone().add(basis.vAxis.clone().multiplyScalar(-tickLen)),
				longStart.clone().add(basis.vAxis.clone().multiplyScalar(tickLen))
			], 0.35);
			addLine([
				longEnd.clone().add(basis.vAxis.clone().multiplyScalar(-tickLen)),
				longEnd.clone().add(basis.vAxis.clone().multiplyScalar(tickLen))
			], 0.35);
		} else {
			const shortStart = localToWorld(-halfU - dimOffset, -halfV);
			const shortEnd = localToWorld(-halfU - dimOffset, halfV);
			addLine([shortStart, shortEnd], 0.35);

			addLine([
				shortStart.clone().add(basis.vAxis.clone().multiplyScalar(-tickLen)),
				shortStart.clone().add(basis.vAxis.clone().multiplyScalar(tickLen))
			], 0.35);
			addLine([
				shortEnd.clone().add(basis.vAxis.clone().multiplyScalar(-tickLen)),
				shortEnd.clone().add(basis.vAxis.clone().multiplyScalar(tickLen))
			], 0.35);

			const longStart = localToWorld(-halfU, -halfV - dimOffset);
			const longEnd = localToWorld(halfU, -halfV - dimOffset);
			addLine([longStart, longEnd], 0.35);

			addLine([
				longStart.clone().add(basis.uAxis.clone().multiplyScalar(-tickLen)),
				longStart.clone().add(basis.uAxis.clone().multiplyScalar(tickLen))
			], 0.35);
			addLine([
				longEnd.clone().add(basis.uAxis.clone().multiplyScalar(-tickLen)),
				longEnd.clone().add(basis.uAxis.clone().multiplyScalar(tickLen))
			], 0.35);
		}

		// 1:φ ratio bar
		const ratioOffset = (uIsShort ? halfV : halfV) + dimOffset * 1.6;
		const x0 = -halfU;
		const y = ratioOffset;
		const r0 = localToWorld(x0, y);
		const r1 = localToWorld(x0 + S * 0.35, y);
		const r2 = localToWorld(x0 + S * 0.35 + S * 0.35 * PHI, y);

		addLine([r0, r1], 0.5);
		addLine([r1, r2], 0.3);

		[r0, r1, r2].forEach(p => {
			addLine([
				p.clone().add(basis.vAxis.clone().multiplyScalar(-tickLen * 0.6)),
				p.clone().add(basis.vAxis.clone().multiplyScalar(tickLen * 0.6))
			], 0.4);
		});

		scene.add(group);
		initialized = true;
	}

	function updateOpacities(t) {
		materials.forEach(({ mat, baseOpacity }) => {
			mat.opacity = t * baseOpacity;
		});
	}

	export function init() {
		create();
	}

	export function updateProjection(projection, schematicDist) {
		if (!group || !initialized) return;
		
		const offset = axis.clone().multiplyScalar(schematicDist * direction);
		group.position.copy(offset);
		
		updateOpacities(projection);
	}

	export function dispose() {
		if (group) {
			scene.remove(group);
			group.traverse(obj => {
				if (obj.geometry) obj.geometry.dispose();
				if (obj.material) obj.material.dispose();
			});
			group = null;
			materials = [];
			initialized = false;
		}
	}
</script>