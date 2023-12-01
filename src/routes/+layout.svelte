<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { mathematics, screenType, isIframe } from '$lib/store/store';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	import Experience from '$lib/three-d/Experience.js'

	onMount(async () => {

		const experience = new Experience(document.querySelector('canvas.webgl'))

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

	<link
	rel="preload"
	href="/fonts/NB-Architekt-Pro-Light.woff"
	as="font"
	type="font/woff"
	crossorigin="anonymous"
/>

<link
	rel="preload"
	href="/fonts/NB-Architekt-Pro-Bold.woff"
	as="font"
	type="font/woff"
	crossorigin="anonymous"
/>

<link rel="preload" href="icons/cv.svg" as="image">
<link rel="preload" href="icons/www.svg" as="image">
<link rel="preload" href="icons/insta.svg" as="image">
<link rel="preload" href="icons/mail.svg" as="image">
</svelte:head>



<div class="{ $mathematics ? 'visible' : 'hidden' }" style="position:absolute;width:100%;padding:10px;background:#f0f0f0;font-family:untitled-serif;display:flex;flex-flow:column;gap:2px;">
	<h2>Daniel Niels Humphries</h2>
	<p style="letter-spacing:1.32px">Neuroscience & Mathematics</p>
	<hr/>
	<h3>Places</h3>
	<a href="https://bushlab-ucl.github.io/"><h4>- UCL :: Human Electrophysiology Lab :: Research Assistant</h4></a>
	<a href="https://www.mis.mpg.de/stochastic-topology-applications"><h4>- Max Planck Institute for Mathematics in the Sciences :: Stochastic Topology Group :: Visiting Research Assistant</h4></a>
	<hr>
	<h3>Interests</h3>
	<p>- Space</p>
	<p>- Concepts</p>
	<p>- Structure</p>
	<hr>
	<h3>Things</h3>
	<p>- nothing to see yet</p>
</div>

<div class="{ $mathematics ? 'hidden' : 'visible' }">
	<canvas class="webgl"></canvas>

	<div class="app">
		{#if $screenType}
		<header>
			<Header />
		</header>

		<main>
			<slot />
		</main>		
		
		{/if}
	</div>
</div>



<footer>
	<Footer />
</footer>


<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		/* height: calc(var(--vh, 1vh) * 100); */
	}

	.webgl {
		position: absolute;
		bottom: 0;
		z-index: -1;
		height: 100dvh;
		min-height: 100dvh;
		width: 100%;
		opacity: 1;
	}
	
	header {
		position: absolute;
		top: 0;
		width: 100%;
	}

	footer {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	main {
		display: flex;
		flex-direction: column;
		/* padding: calc(1 * var(--margin)); */
		width: 100%;
		height: 100%;
	}

	/* p,
	a {
		font-size: 13px;
	} */

	.visible {
			opacity: 1;
			z-index: 10;
	}

	.hidden {
			opacity: 0;
			z-index: -10;
	}
</style>
