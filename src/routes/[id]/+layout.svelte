<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating, page } from "$app/stores";
    import LoadIndicator from "$lib/components/actions/LoadIndicator.svelte";
    import Preview from "$lib/components/Preview.svelte";
    import Drop from "$lib/components/Drop.svelte";
    import { previewAndSetDropItems } from "$lib/scripts/utils";
    import { previewItem } from "$lib/scripts/stores";
    import BackButton from "$lib/components/actions/BackButton.svelte";

    let id: string;
    $: id = $page.params.id ?? "";
    let backButton: HTMLDivElement;
    $: backButton &&
        (backButton.style.display = id === "r" ? "none" : "initial");
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

<div class="layout">
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
                <div class="nav">
                    <Nav />
                </div>
                <div class="back" bind:this={backButton}>
                    <BackButton />
                </div>
                <slot />
            </div>
            <Preview />
            <Drop />
        </main>
    {/if}
</div>

<style>
    .layout {
        display: flex;
        background-color: inherit;
    }
    .main {
        background-color: inherit;
        display: flex;
    }
    .back {
        position: sticky;
        top: 1.5rem;
        z-index: 1;
    }
    .content {
        background-color: inherit;
        width: 100%;
    }
    .dragover {
        background-color: #00f5;
    }
    .nav {
        background-color: inherit;
        display: none;
        z-index: 1;
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
    @media (max-width: 600px) {
        .nav {
            display: initial;
        }
        .back {
            display: none;
        }
        .layout {
            display: initial;
        }
    }
</style>
