<script>
	import './styles.css';

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
	<title>Daniel Humphries</title>
	<meta name="description" content="Human." />
	<meta
		name="keywords"
		content=""
	/>
	<meta name="author" content="Daniel Humphries" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:title" content="Daniel Humphries" />
	<meta
		property="og:description"
		content="Daniel Humphries. Neuroscience, Graphics Engines, Rendering, Mathematics, Words."
	/>
	<meta property="og:image" content="https://www.danielniels.co.uk/niels_bw.jpg" />
</svelte:head>

<main>
		<div class="header">
				<p>Daniel Humphries [ 🍉 ]</p>
				<hr>
				<img src="niels_bw.jpg" alt="daniel humphries, this is my website." width=154 height = 154 />
				<hr>
				<p>daniel.c.humphries@[A]</p>
				<p>d.humphries@[B]</p>
				<hr>
				<a href="https://www.kcl.ac.uk/research/disordered-systems"><p>king's app. mathematics</p></a>
				<a href="https://bushlab-ucl.github.io/"><p>ucl comp. neuroscience</p></a>
				<a href="https://www.tcplab.org/home"><p>ucl comp. psychiatry</p></a>
				<hr>		
				<a href="https://aufbau.io"><p>websites / visual art</p></a>
				<hr>
				<p>[ A = kcl.ac.uk ]</p>
				<p>[ B = ucl.ac.uk ]</p>
				<hr>
		</div>
		<slot />
</main>

<style>
	main {
		font-family: serif;
		display: flex;
		padding: 10px;
		overflow: hidden; /* Prevent scrolling on the main container */
		height: 100dvh;
		max-height: 100dvh;
		padding-left: 20px;
		padding-top: 10px;
		box-sizing: border-box;
	}
	.header {
			flex: 0 0 154px; /* Fixed width for the first column */
			box-sizing: border-box;
			/* Add any specific height if required */
	}

	.header p {
		margin-bottom: 0px;
	}

	img {
			border: 1px solid black;
			margin: 5px 0 0px 0;
	}

	@media (max-width: 767px) {

main {
	height: 100%;
	max-height: 100%;
	overflow: auto;
}

a {
	-webkit-text-decoration-color: red;
	text-decoration-color: red;
}

a:hover {
	text-decoration: underline;
}

@media (max-width: 767px) {
	main {
		overflow-x: hidden;
	}

	.header {
		flex: 0 0 160px; /* fix overflow isssue */
	}
}
}
</style>
