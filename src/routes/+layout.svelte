<script>
	import './styles.css';

	import { onMount } from 'svelte';
	import { screenType, isIframe } from '$lib/store/store';

	let Scene;

	onMount(async () => {
		// webgl
		const module = await import('$lib/three/scene.svelte');
		Scene = module.default;

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
	<meta name="description" content="" />
	<meta
		name="keywords"
		content="Daniel Humphries, Dan Humphries, UCL, d.humphries@ucl.ac.uk, Neuroscience, Mathematics, Computational Psychiatry"
	/>
	<meta name="author" content="Daniel Humphries" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:title" content="Daniel Humphries" />
	<meta
		property="og:description"
		content=""
	/>
	<meta property="og:image" content="https://danielniels.co.uk/favicon.ico" />
</svelte:head>

<main>
		<div class="header">
				<!-- <h2>Daniel Humphries</h2> -->
				<!-- <p class="less-spacing">[ Niels for Art Things ]</p> -->

				<img src="daniel-2.jpg" alt="daniel niels humphries, this is my website." width=144 />
				<a href="https://www.kcl.ac.uk/research/disordered-systems"><p>□ king's mathematics </p></a>
				<a href="https://bushlab-ucl.github.io/">□ ucl neuroscience</a>
				<a href="https://www.tcplab.org/home"><p>□ ucl comp. psychiatry</p></a>
				<!-- <a href="https://aufbau.io"><p>aufbau.io</p></a> -->
				<!-- <hr style="margin-top:5px;border-color:var(--primary-50);"/> -->
		</div>
		<slot />
</main>

{#if Scene}
	<svelte:component this={Scene} />
{/if}


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
		letter-spacing: 0.1em;	
	}

	img {
			border: 1px solid var(--accent-50);
			margin: 5px 0 0px 0;
	}

	@media (max-width: 540px) {

		main {
			height: 100%;
			max-height: 100%;
			overflow: auto;
		}

		/* .text-container {
			height: 100%;
			max-height: 100%;
			overflow: auto;
		} */

		a:hover {
			text-decoration: underline;
		}

	}
</style>
