<script>
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/LoadIndicator.svelte";
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>

<Header />
{#if $navigating}
    <LoadIndicator />
{:else}
    <Nav />
    <main class="main">
        <slot />
    </main>
{/if}
<div class="preview" />
<div class="drop-zone" />
