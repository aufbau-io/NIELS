<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { screenType, is_iframe } from '$lib/store/store';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	let Geometry;
	onMount(async () => {

		const module = await import('$lib/components/three/lorentz.svelte');
		Geometry = module.default;

		// ---------------------------------------------------------------------------
		// SCREEN
		// ---------------------------------------------------------------------------
		const ua = navigator.userAgent;
		if (
			/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
		) {
			// phone
			screenType.set(1);
		} else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			// tablet
			screenType.set(2);
		} else {
			//laptop
			screenType.set(3);
		}

		if (window.location !== window.parent.location) {
			// The page is in an iframe
			is_iframe.set(true);
		}
	});
</script>

<svelte:component this={Geometry} />


<div class="app">
	{#if $screenType}
	<header>
		<Header />
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<Footer />
	</footer>
	{/if}
</div>


<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
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
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: calc(4 * var(--margin));
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

</style>
