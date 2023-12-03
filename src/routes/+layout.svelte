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



<div class="{ $mathematics ? 'visible' : 'hidden' }" style="position:absolute;height:100%;width:100%;padding:10px;background:#fafafa;font-family:serif;display:flex;flex-flow:column;gap:2px;">
	<h2>Daniel Niels Humphries</h2>
	<img src="niels.jpg" width=190 />
	<p style="letter-spacing:1.35px">Neuroscience & Mathematics</p>
	<hr/>
	<h3>Places</h3>
	<a href="https://bushlab-ucl.github.io/"><p>- UCL :: Human Electrophysiology Lab :: Research Assistant</p></a>
	<a href="https://www.mis.mpg.de/stochastic-topology-applications"><p>- Max Planck Institute for Mathematics in the Sciences :: Stochastic Topology Group :: Visiting Research Assistant</p></a>
	<hr>
		<h3>Interests</h3>
	<p>- Space</p>
	<p>- Structure</p>
	<p>- Concepts</p>
	<hr>
	<!-- <h3>Interests</h3>
	<p>- Space :: <a href="https://www.gutenberg.org/files/4280/4280-h/4280-h.htm">Kant</a>, <a href="https://www.grothendieckcircle.org/">Grothendieck</a>, <a href="https://www.sainsburywellcome.org/web/groups/behrens-lab">Behrens</a></p>
	<p>- Structure :: <a href="https://www.gutenberg.org/files/5740/5740-pdf.pdf">Wittgenstein</a>, <a href="https://en.wikipedia.org/wiki/Yoneda_lemma">Yoneda</a></p>
	<p>- Concepts :: <a href="https://plato.stanford.edu/entries/nonexistent-objects/">Meinong</a>, <a href="https://www.phil.cmu.edu/projects/carnap/editorial/latex_pdf/1928-1e%20part1.pdf">Carnap</a>,  <a href="https://link.springer.com/content/pdf/10.1016/j.thbio.2006.02.001.pdf">Jost</a></p>
	<hr> -->
	<h3>Things</h3>
	<a href="/Harvesting_and_Sowing.pdf"><p>- Harvesting and Sowing :: Alexander Grothendieck :: English Version :: Niels Machine Tranlation (Very Rough WIP)</p></a>
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
		z-index: 11;
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
