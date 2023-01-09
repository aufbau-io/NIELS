<script>
	import Nav from './nav.svelte';
	import { darkMode, screenType } from '$lib/store/store';
	// stub data out
	const navItems = [
		{
			name: 'AUFBAU',
			href: '/'
		},
		{
			name: 'PROJECTS',
			href: '/'
		},
		{
			name: 'ART / MATHS',
			href: '/'
		},
		{
			name: 'ABOUT',
			href: '/'
		},
	];

	let toggleDarkMode = () => {
		darkMode.set(!$darkMode);
		document.querySelector(':root').classList.toggle('dark-mode');
	};
</script>

<header>
	<main>
	{#if $screenType == 3}
		<Nav {navItems} />
	{/if}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={() => toggleDarkMode()} class="darkMode">
		<p class:selected={$darkMode == false}>day</p>
		<p class="selected">/</p>
		<p class:selected={$darkMode == true}>night</p>
	</div>
</main>
</header>

<style>
	header {
		user-select: none;
		color: var(--primary);
		/* border-bottom: solid 1px var(--primary-50);
		background: var(--background);
		box-shadow: 0px -1px 8px var(--orimary-50); */
	}

	main {
		margin: auto;
		max-width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 0 16px 0 8px;
		font-size: 14px;
		height: 60px;
		font-family: nb-architekt;
		font-weight: 500;
	}

	.darkMode {
		display: flex;
	}

	.app_link {
		opacity: 0.3;
	}

	.logo {
		padding: 20px 16px;
		text-transform: none;
	}

	.tag {
		padding: 20px 16px;
	}

	.darkMode p {
		line-height: 110%;
		font-size: 15px;
		letter-spacing: 0.1em;
		padding: 10px;
		cursor: pointer;
		opacity: 0.4;
	}

	.darkMode p.selected {
		opacity: 1;
	}

	@media only screen and (max-width: 768px) {
		header {
			padding: 0 18px;
			justify-content: flex-end;
		}
	}
</style>
