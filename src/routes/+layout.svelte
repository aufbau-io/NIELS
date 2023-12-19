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
<div class="main { $mathematics ? 'visible' : 'hidden' }" style="padding:10px;position:absolute;height:auto;width:100%;font-family:serif;display:flex;flex-flow:column;gap:2px;">
		<h2>Daniel Niels Humphries</h2>
		<img src="niels.jpg" style="border:solid 1px black;" width=188 />
		<p style="letter-spacing:1.35px">Neuroscience & Mathematics</p>
		<h3>Places</h3>
		<a href="https://bushlab-ucl.github.io/"><p>- UCL :: Human Electrophysiology Lab :: Research Assistant</p></a>
		<a href="https://www.mis.mpg.de/stochastic-topology-applications"><p>- Max Planck Institute for Mathematics in the Sciences :: Stochastic Topology Group :: Visiting</p></a>
			<h3>Interests</h3>
		<p>- Space</p>
		<p>- Structure</p>
		<p>- Concepts</p>
	</div>
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
		opacity: .5
	}
</style>
