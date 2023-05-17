<script>
	import { page } from '$app/stores';
	import { screenType } from '$lib/store/store';

	export let navItems = [];
	export async function load() {
		return {
			props: {
				navItems
			}
		};
	}
</script>

<nav>

	{#each navItems as navItem}
		<a href={navItem.href} class="" class:active={navItem.href === $page.url.pathname}
			>{navItem.name}</a
		>
	{/each}

	<!-- <a href="https://aufbau.io" target="_blank">EIN AUFBAU DING</a> -->
</nav>

<style>
	nav {
		align-self: baseline;
		display: flex;
		flex-flow: row wrap;
		background: var(--primary);
		color: var(--background);
		border: solid 1px var(--blue);
	}
	nav a,
	nav p {
		padding: 10px 10px;
		font-size: 13px;
		cursor: pointer;
		color: inherit;
	}

	nav a:hover {
		opacity: 0.6;
	}

	nav a.active {
		font-weight: 700;
	}

	.active,
	.active:hover {
		opacity: 1;
	}
</style>
