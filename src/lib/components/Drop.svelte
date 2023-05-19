<script>
    import { dropItems, previewItem } from "$lib/scripts/utils";
    import DropItem from "./DropItem.svelte";
    import DropTools from "./DropTools.svelte";
    import doubleLeftIcon from "$lib/assets/doubleLeft.svg?raw";
    import { fly } from "svelte/transition";

    let mini = false;
    function toggleMini() {
        mini = !mini;
    }
</script>

{#if $dropItems.length !== 0}
    {#if mini}
        <button
            class="drop-mini btn"
            on:click={() => {
                $previewItem = undefined;
                mini = !mini;
            }}>{@html doubleLeftIcon}</button
        >
    {:else}
        <div class="drop" transition:fly={{ duration: 500, x: 500, y: 500 }}>
            <DropTools on:toggleMini={toggleMini} />

            <div class="drop-items">
                {#each $dropItems as item}
                    {#key item.id}
                        <DropItem {item} />
                    {/key}
                {/each}
            </div>
        </div>
    {/if}
{/if}

<style>
    .drop-mini {
        position: fixed;
        bottom: 1rem;
        right: 0;
        background-color: #043;
        z-index: 2;
        filter: none;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }
    .drop {
        position: sticky;
        top: 0;
        background-color: inherit;
        border-left: 1px solid var(--primary-color);
        overflow-y: scroll;
        padding: 0rem 1rem 1rem 1rem;
        max-width: 50%;
        z-index: 2;
        min-width: 50%;
        height: 100vh;
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
    }

    .drop-items {
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        align-self: start;
        align-items: center;
        justify-content: space-evenly;
        gap: 2rem 1rem;
    }
    .drop :global(input) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        flex-shrink: 2;
        width: 100%;
        border: none;
        outline: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 1.6rem;
        color: #000;
        background-color: #ddd;
        border-bottom: 2px solid #000;
        padding-left: 0.5rem;
    }
    .drop :global(input::placeholder) {
        color: #555;
    }
    .drop :global(input:hover) {
        background-color: #ccc;
    }
    .btn :global(svg) {
        fill: var(--color-white);
    }
    @media (max-width: 600px) {
        .drop-items {
            gap: 1rem;
        }
    }
</style>
