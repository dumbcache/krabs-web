<script lang="ts">
    import { activeDirs, mode, searchItems } from "$lib/scripts/stores";
    import { onMount, onDestroy } from "svelte";

    let search: string;

    function updateSearchItems() {
        $searchItems = $activeDirs?.filter((dir) => {
            return dir.name.toLowerCase().includes(search.trim().toLowerCase());
        });
    }
    onMount(() => {
        setTimeout(() => {
            search = "";
            $searchItems = $activeDirs;
        }, 0);
    });
    onDestroy(() => {
        $searchItems = undefined;
    });
</script>

<div class="search">
    <input
        type="search"
        placeholder="Search"
        bind:value={search}
        on:input={updateSearchItems}
        autofocus
    />
</div>

<style>
    input {
        width: 100%;
        border: none;
        outline: none;
        border-radius: 0.5rem;
        padding: 0.7rem;
        font-size: 1.6rem;
        color: var(--primary-color);
        background-color: var(--input-background);
        border-bottom: 2px solid var(--color-black);
        padding-left: 0.5rem;
    }

    input:hover {
        background-color: var(--theme-button-hover-outline);
    }

    @media (max-width: 600px) {
        input {
            padding: 0.5rem;
            font-size: 1.5rem;
        }
    }
</style>
