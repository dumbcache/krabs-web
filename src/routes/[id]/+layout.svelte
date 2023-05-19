<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/LoadIndicator.svelte";
    import Preview from "$lib/components/Preview.svelte";
    import Drop from "$lib/components/Drop.svelte";
    import { previewAndSetDropItems, previewItem } from "$lib/scripts/utils";

    let draggedOver = false;
    export function imgDropHandler(e: DragEvent) {
        e.preventDefault();
        draggedOver = false;
        console.log(e);
        previewItem.set(undefined);
        if (e.dataTransfer?.files) {
            previewAndSetDropItems(e.dataTransfer.files);
        }
    }
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>

<Header />
{#if $navigating}
    <LoadIndicator />
{:else}
    <main
        class="main {draggedOver === true ? 'dragover' : ''}"
        on:dragstart|preventDefault
        on:dragover|preventDefault
        on:dragenter={() => (draggedOver = true)}
        on:dragleave={() => (draggedOver = false)}
        on:drop={imgDropHandler}
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
    .dragover {
        background-color: #00f5;
    }
    @media (max-width: 800px) {
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
