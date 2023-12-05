<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { mathematics, screenType, isIframe } from '$lib/store/store';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	import Experience from '$lib/three-d/Experience.js'

	onMount(async () => {

		new Experience(document.querySelector('canvas.webgl'))

		function getDeviceType() {
			const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
				// This is a device which supports touch
				if (width <= 767) {
					// Mobile
					return 1;
				} else {
					// Tablet
					return 2;
				}
			} else {
				// This is likely a laptop or desktop
				return 3;
			}
		}

		screenType.set(getDeviceType());
		isIframe.set(window.location !== window.parent.location);
	});
</script>

<svelte:head>
	<title>DANIEL HUMPHRIES</title>
	<meta name="description" content="Daniel Humphries. Neuroscience and Mathemtics. UCL." />
</svelte:head>


<canvas class="webgl"></canvas>

<main>
	<slot />
</main>		


<style>
	.webgl {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: -1;
		height: 100dvh;
		min-height: 100dvh;
		width: 100%;
		opacity: 1;
	}
</style>
