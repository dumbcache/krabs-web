<script>
    import {
        dropFull,
        dropItems,
        dropMini,
        previewItem,
    } from "$lib/scripts/stores";
    import DropItem from "$lib/components/drops/DropItem.svelte";
    import DropTools from "$lib/components/drops/DropTools.svelte";
    import doubleLeftIcon from "$lib/assets/doubleLeft.svg?raw";
    import { fly } from "svelte/transition";
</script>

{#if $dropItems.length !== 0}
    {#if $dropMini}
        <button
            class="drop-mini btn"
            on:click={() => {
                $previewItem = undefined;
                $dropMini = !$dropMini;
            }}>{@html doubleLeftIcon}</button
        >
    {:else}
        <div
            class="drop {$dropFull === true ? 'full' : ''}"
            transition:fly={{ duration: 500, x: 500, y: 500 }}
        >
            <DropTools />

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
        z-index: 1;
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
        z-index: 1;
        min-width: 50%;
        height: 100vh;
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
    }
    .full {
        min-width: 100%;
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
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 1.6rem;
        color: var(--primary-color);
        background-color: var(--input-background);
        border-bottom: 2px solid var(--color-black);
        padding-left: 0.5rem;
    }

    .drop :global(input:disabled:hover),
    .drop :global(input:disabled) {
        background-color: var(--primary-bg-color);
        color: var(--color-black-level-six);
        cursor: not-allowed;
    }
    .drop :global(input:hover) {
        background-color: var(--color-white-level-four);
        background-color: var(--theme-button-hover-outline);
    }
    .btn :global(svg) {
        fill: var(--color-white);
    }
    @media (max-width: 800px) {
        .drop-mini,
        .drop {
            z-index: 2;
        }
    }
    @media (max-width: 600px) {
        .drop-items {
            gap: 1rem;
        }
    }
</style>
