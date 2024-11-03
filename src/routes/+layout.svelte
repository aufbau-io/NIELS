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
	<title>DANIEL HUMPHRIES</title>
	<meta name="description" content="Human." />
	<meta
		name="keywords"
		content="Daniel Humphries, Dan Humphries, D.N. Humphries, Niels, Daniel Niels, UCL, d.humphries@ucl.ac.uk, Neuroscience, Graphics, Mathematics, Words, Machien Learning, AI, Computational Psychiatry"
	/>
	<meta name="author" content="Daniel Humphries" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:title" content="NIELS // DANIEL HUMPHRIES" />
	<meta
		property="og:description"
		content="Daniel Humphries. Neuroscience, Graphics Engines, Rendering, Mathematics, Words."
	/>
	<meta property="og:image" content="https://danielniels.co.uk/niels_bw.jpg" />
</svelte:head>

<main>
		<div class="header">
				<h2>Daniel Humphries</h2>
				<!-- <p class="less-spacing">[ Niels for Art Things ]</p> -->
				<p class="less-spacing">d.humphries@ucl.ac.uk</p>
				<img src="niels_bw.jpg" alt="daniel niels humphries, this is my website." width=144 height = 144 />
				<!-- <a href="https://aufbau.io"><p>websites/apps/graphics</p></a> -->
				<a href="https://www.kcl.ac.uk/research/disordered-systems"><p>king's mathematics</p></a>
				<a href="https://bushlab-ucl.github.io/"><p>ucl comp. neurosci</p></a>
				<a href="https://www.tcplab.org/home"><p>ucl comp. psychiatry</p></a>
				<hr style="margin-top:5px;"/>
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
			flex: 0 0 148px; /* Fixed width for the first column */
			box-sizing: border-box;
			/* Add any specific height if required */
	}

	.header p {
		margin-bottom: 0px;
	}

	.header p.less-spacing {
		letter-spacing: 0.082em;
		color: red;
		font-style: italic;
	} 

	img {
			border: 1px solid black;
			margin: 5px 0 0px 0;
	}


	h2 {
			padding-left: 0px;
			font-size: 16px;
			font-weight: normal;
			letter-spacing: 0.115em;

	}

	@media (max-width: 767px) {

main {
	height: 100%;
	max-height: 100%;
	overflow: auto;
}

.text-container {
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

}
</style>
