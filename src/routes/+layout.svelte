<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { screenType, isIframe } from '$lib/store/store';

	onMount(async () => {
		// new Experience(document.querySelector('canvas.webgl'))

		function getDeviceType() {
			const width =
				window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

			if (
				'ontouchstart' in window ||
				navigator.maxTouchPoints > 0 ||
				navigator.msMaxTouchPoints > 0
			) {
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
	<title>NIELS // DANIEL HUMPHRIES</title>
	<meta name="description" content="Welcome to my world." />
	<meta
		name="keywords"
		content="Daniel Humphries, Dan Humphries, Niels, Daniel Niels, UCL, Neuroscience, Graphics, Mathematics, Words"
	/>
	<meta name="author" content="Daniel Humphries" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:title" content="NIELS // DANIEL HUMPHRIES" />
	<meta
		property="og:description"
		content="Daniel Humphries. Neuroscience, Graphics, Mathematics, Words."
	/>
	<meta property="og:image" content="https://danielniels.co.uk/niels_bw.jpg" />
</svelte:head>

<main>
	<slot />
</main>

<style>
</style>
