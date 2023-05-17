<script>
	import Nav from './nav.svelte';
	import { darkMode, screenType } from '$lib/store/store';

	// import { page } from '$app/stores';
	// import { goto } from '$app/navigation';

	// stub data out
	const navItems = [
		{
			name: 'EMMETT THOMPSON',
			href: '/'
		},
		{
			name: 'PUBLICATIONS',
			href: '/publications'
		},
		{
			name: 'MISC.',
			href: '/misc'
		},
	
		{
			name: 'CONTACT',
			href: '/contact'
		},
	];

	let toggleDarkMode = () => {
		darkMode.set(!$darkMode);
		document.querySelector(':root').classList.toggle('dark-mode');

// 		if ($page.url.pathname == '/') {
// goto(`/art`, { replaceState: true }) 
// 		}
	};
</script>

<header>
	<main>

		<Nav {navItems} />

	<div on:click={() => toggleDarkMode()} on:keydown={() => toggleDarkMode()} class="darkMode right">
		<p class:selected={$darkMode == false}>ONLINE</p>
		<p class="selected">/</p>
		<p class:selected={$darkMode == true}>OFFLINE</p>
	</div>

</main>
</header>

<style>
	header {
		user-select: none;
		color: var(--primary);
	}

	main {
		margin: auto;
		max-width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		padding: 10px;
		font-size: 13px;
		height: calc(2 * var(--margin));
		font-weight: 300;
		
	}

	.darkMode {
		background: var(--primary);
		color: var(--background);

		display: flex;
		gap: 12px;
		padding: 6px 12px;
		cursor: pointer;
	}

	.left {
		justify-content: start;
	}

	.right {
		justify-content: end;
	}

	.app_link {
		opacity: 0.3;
	}

	.darkMode p {
		font-size: 13px;
		opacity: 0.5;
		color: inherit;
	}

	.darkMode p.selected {
		opacity: 1;
	}

	@media only screen and (max-width: 768px) {

	}
</style>
