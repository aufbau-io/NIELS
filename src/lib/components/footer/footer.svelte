<script>
	import { mathematics, screenType } from '$lib/store/store';

	// function to toggle mathematics mode in store
	function setMathematics() {
		mathematics.set(!$mathematics);
	}
</script>

<footer>
	<!-- <a href="https://aufbau.io" target="_blank" rel="noreferrer">EIN AUFBAU DING</a> -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p on:click={() => setMathematics()}>Mathematician Friendly Mode :: {$mathematics ? 'ON' : 'OFF'}</p>
	{#if $screenType == 3}
	<a href="https://www.websitecarbon.com/website/niels-aufbau-io/" target="_blank" rel="noreferrer">0.08G CO2 / VISIT</a>
	{/if}
	<!-- <p class="">COPYRIGHT 2022</p> -->
</footer>

<style>
	footer {
		width: 100%;

		z-index: 10;
		gap: 10px;

		padding: 30px 20px;
		height: calc(2 * var(--margin));

		border-top: solid 1px var(--accent-50);
		text-transform: none;


		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}

	footer a,
	footer p {
		background: var(--background);
		color: var(--primary);
		border: var(--border);

		padding: 6px 10px;

		letter-spacing: 0.15em;
		font-family: var(--font-body);
		cursor: pointer;
		user-select: none;
	}

	@media only screen and (max-width: 768px) {
		footer {

		}
		footer a,
		footer p {
			font-size: 12px;
			width: 100%;
		}
	}
</style>
