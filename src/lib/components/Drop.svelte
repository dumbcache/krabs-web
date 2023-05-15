<script>
    import { dropItems } from "$lib/scripts/utils";
    import DropItem from "./DropItem.svelte";
    import DropTools from "./DropTools.svelte";
    import doubleLeftIcon from "$lib/assets/doubleLeft.svg?raw";

    let mini = false;
    function toggleMini(e) {
        console.log(e);
        mini = !mini;
    }
    $: console.log($dropItems);
</script>

{#if $dropItems.length !== 0}
    {#if mini}
        <button
            class="drop-mini btn"
            on:click={() => {
                mini = !mini;
            }}>{@html doubleLeftIcon}</button
        >
    {:else}
        <div class="drop">
            <DropTools on:toggleMini={toggleMini} />
            <div class="drop-items">
                {#each $dropItems as item}
                    <DropItem {item} />
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
        z-index: 3;
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
</style>
