<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { screenType, isIframe, darkMode } from '$lib/store/store';

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
	<title>NIELS DANIEL</title>
	<meta name="description" content="Part-Time Web Engineer, Part-Time Neuroscientist, Full-Time Loser." />

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

<canvas class="webgl"></canvas>

<div class="app">
	{#if $screenType}
	<header>
		<Header />
	</header>

	<main>
		<slot />
	</main>

	{#if $screenType == 3}
	<footer>
		<Footer />
	</footer>
	{/if}
	
	{/if}
</div>


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
</style>
