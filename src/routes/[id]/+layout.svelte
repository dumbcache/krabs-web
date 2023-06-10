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
        shortcutHandler,
        loadGSIScript,
    } from "$lib/scripts/utils";
    import { dropMini, mode, previewItem } from "$lib/scripts/stores";
    import BackButton from "$lib/components/actions/BackButton.svelte";
    import { onMount } from "svelte";
    import Search from "$lib/components/actions/Search.svelte";

    let draggedOver = false;
    export function imgDropHandler(e: DragEvent) {
        e.preventDefault();
        draggedOver = false;
        $dropMini = false;
        previewItem.set(undefined);
        if (e.dataTransfer?.files) {
            previewAndSetDropItems(e.dataTransfer.files);
        }
    }
    onMount(() => {
        try {
            setCacheName();
            updateRecents();
            loadGSIScript();
        } catch (error) {
            console.warn(error);
        }
    });
</script>

<svelte:window
    on:offline={() => {
        console.log("offline");
        window.alert("You're offline");
    }}
    on:keydown={shortcutHandler}
/>

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
                <div class="back">
                    <BackButton />
                </div>
                {#if $mode === "search"}
                    <div class="search">
                        <Search />
                    </div>
                {/if}
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
        width: 100%;
        min-height: 100vh;
    }
    .back {
        position: sticky;
        top: 1.5rem;
        z-index: 1;
    }
    .search {
        max-width: 30rem;
        margin: auto;
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
        .search {
            top: 5rem;
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
