<script>
	import Nav from './nav.svelte';
	import { darkMode, screenType } from '$lib/store/store';

	// import { page } from '$app/stores';
	// import { goto } from '$app/navigation';

	
	import mail from '$lib/images/icons/mail.svg';
	import insta from '$lib/images/icons/insta.svg';
	import www from '$lib/images/icons/www.svg';

	// stub data out
	const navItems = [
		{
			name: 'NIELS',
			href: '/'
		},
		{
			name: 'NEUROSCIENCE',
			href: '/neuroscience'
		},
		{
			name: 'TECHNOLOGY',
			href: '/technology'
		},
		{
			name: 'ART',
			href: '/art'
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

		{#if $screenType == 3}
		<div class="darkMode">
			<p>NIELS HUMPHRIES</p>
		</div>
		{/if}

		<Nav {navItems} />

	<!-- <div on:click={() => toggleDarkMode()} on:keydown={() => toggleDarkMode()} class="darkMode right">
		<p class:selected={$darkMode == false}>ONLINE</p>
		<p class="selected">/</p>
		<p class:selected={$darkMode == true}>OFFLINE</p>
	</div> -->

	<div class="icons">
		<a href="mailto: dan@aufbau.io">
			<img src={mail} alt="mail" class="icon" />
		</a>
		<a href="https://www.instagram.com/dn.niels" target="_blank" rel="noreferrer">
			<img src={insta} alt="instagram" class="icon" />
		</a>
		<a href="https://www.aufbau.io" target="_blank" rel="noreferrer">
			<img src={www} alt="instagram" class="icon" />
		</a>
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

		padding: 20px;
		font-size: 13px;
		height: calc(2 * var(--margin));
	}

	p, a {
		font-weight: 600;
	}

	.icons {
		display: flex;
		gap: 15px;
		padding: 6px 15px;
		justify-content: space-evenly;
		border: var(--border);
	}


	.icon {
		height: 20px;
		width: 20px;

		cursor: pointer;
		opacity: 1;
	}

	.icon:hover{
		opacity:.5;
		}

	.darkMode {
		background: var(--background);
		color: var(--primary);
		border: var(--border);
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
		color: inherit;
	}

 	.right p {
		opacity: .5;
	}

	.darkMode p.selected {
		opacity: 1;
	}

	@media only screen and (max-width: 768px) {

	}
</style>
