<script>
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/LoadIndicator.svelte";
    import Preview from "$lib/components/Preview.svelte";
    import Drop from "$lib/components/Drop.svelte";
    import { dropHandler } from "$lib/scripts/utils";
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>

<Header />
{#if $navigating}
    <LoadIndicator />
{:else}
    <main
        class="main"
        on:dragstart|preventDefault
        on:dragover|preventDefault
        on:dragenter
        on:dragleave
        on:drop={dropHandler}
    >
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
        width: 100%;
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
            max-width: 100%;
        }
    }
</style>
