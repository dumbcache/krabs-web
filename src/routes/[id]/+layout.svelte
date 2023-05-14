<script>
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/LoadIndicator.svelte";
    import Preview from "$lib/components/Preview.svelte";
    import Drop from "$lib/components/Drop.svelte";
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>

<Header />
{#if $navigating}
    <LoadIndicator />
{:else}
    <main class="main">
        <div class="content">
            <Nav />
            <slot />
        </div>
        <Preview />
        <Drop />
    </main>
{/if}

<style>
    .main {
        background-color: inherit;
        display: flex;
    }
    .content {
        background-color: inherit;
        grid-area: content;
    }
    .main :global(.preview),
    .main :global(.drop) {
        z-index: 1;
        min-width: 50%;
        height: 100vh;
        background-color: #000a;
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
    }
    @media (max-width: 600px) {
        .main :global(.preview),
        .main :global(.drop) {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border: none;
        }
    }
</style>
