<script lang="ts">
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/actions/LoadIndicator.svelte";
    import Preview from "$lib/components/Preview.svelte";
    import Drop from "$lib/components/Drop.svelte";
    import {
        previewAndSetDropItems,
        updateRecents,
        setCacheName,
    } from "$lib/scripts/utils";
    import { previewItem, online } from "$lib/scripts/stores";
    import BackButton from "$lib/components/actions/BackButton.svelte";
    import Offline from "$lib/components/actions/Offline.svelte";
    import { onMount } from "svelte";

    let draggedOver = false;
    export function imgDropHandler(e: DragEvent) {
        e.preventDefault();
        draggedOver = false;
        previewItem.set(undefined);
        if (e.dataTransfer?.files) {
            previewAndSetDropItems(e.dataTransfer.files);
        }
    }
    onMount(() => {
        setCacheName();
        updateRecents();
    });
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>
<svelte:window
    on:offline={() => {
        $online = false;
        console.log("offline");
    }}
    on:online={() => {
        console.log("online");
        $online = true;
    }}
/>

<div class="layout">
    {#if $online}
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
                    <div class="back">
                        <BackButton />
                    </div>
                    <slot />
                </div>
                <Preview />
                <Drop />
            </main>
        {/if}
    {:else}
        <Offline />
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
        width: 100%;
        min-height: 100vh;
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
        background-color: #55f5;
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
        .main {
            min-height: initial;
        }
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
