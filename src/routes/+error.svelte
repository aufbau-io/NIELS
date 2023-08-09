<script>
	import ErrorScreen from '$lib/components/error/errorScreen.svelte'; // your own Error screen component
	import NotFoundScreen from '$lib/components/error/notFoundScreen.svelte'; // your own 404 screen component

	import { page } from '$app/stores';
</script>

<!-- Used '==' instead of '===' to match string/number status code (just to be sure) -->
{#if $page.status == 404}
	<NotFoundScreen />
{:else}
	<ErrorScreen status={$page.status} error={$page.error.message} />
{/if}
