<script>
	export let selected;
	export let scale;
	export let type;

	import { goto } from '$app/navigation';
	import { page, navigating } from '$app/stores';

	import { lobbySelected } from '$lib/store/store.js';

	let test = () => {
		let selectedPage;
		let url = $page.url.pathname.match(/(\/[A-Za-z0-9]*)/)[1];
		console.log(url);
		if (url == '/') {
			selectedPage = 'lobby';
		} else {
			selectedPage = url.substring(1);
		}
		lobbySelected.update(() => selectedPage);
	};

	$: if ($navigating == null) test();

	import Lobby from './lobby.svelte';
	import Library from './library.svelte';
	import Laboratory from './laboratory.svelte';
	import Arcade from './arcade.svelte';
	import Studio from './studio.svelte';

	export let setNav = (choice) => {
		selected = choice;
		if (type == 'lobby') {
			lobbySelected.update(() => choice);
		} else {
			if (choice == 'lobby') {
				goto(`/`, true);
			} else {
				goto(`/${choice}`, true);
			}
		}
	};
</script>

<svg
	style="transform:scale({scale});"
	width="462"
	height="469"
	viewBox="0 0 462 469"
	fill="none"
	class="nav-svg"
	xmlns="http://www.w3.org/2000/svg"
>
	{#if $lobbySelected != 'lobby'}
		<Lobby active={$lobbySelected == 'lobby'} {setNav} {type} />
	{/if}
	{#if $lobbySelected != 'studio'}
		<Studio active={$lobbySelected == 'studio'} {setNav} />
	{/if}
	<Library active={$lobbySelected == 'library'} {setNav} />
	{#if $lobbySelected == 'studio'}
		<Studio active={$lobbySelected == 'studio'} {setNav} />
	{/if}
	{#if $lobbySelected != 'laboratory'}
		<Laboratory active={$lobbySelected == 'laboratory'} {setNav} />
	{/if}
	<Arcade active={$lobbySelected == 'arcade'} {setNav} />
	{#if $lobbySelected == 'laboratory'}
		<Laboratory active={$lobbySelected == 'laboratory'} {setNav} />
	{/if}
	{#if $lobbySelected == 'lobby'}
		<Lobby active={$lobbySelected == 'lobby'} {setNav} {type} />
	{/if}
</svg>

<style>
	svg {
		fill: var(--black);
		stroke: var(--white);
		cursor: pointer;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
