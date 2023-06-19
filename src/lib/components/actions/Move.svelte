<script lang="ts">
    import doneIcon from "$lib/assets/done.svg?raw";
    import {
        activeParentId,
        activeParentName,
        mode,
        recents,
    } from "$lib/scripts/stores";

    let recentsClicked = false;
    let selectedName = $activeParentName;
    let selectedId = $activeParentId;
</script>

<div class="move" on:keydown={() => {}} on:click={() => ($mode = "select")}>
    <div class="selection" on:click|stopPropagation on:keydown={() => {}}>
        <button class="btn">/r</button>
        <button
            class="selected"
            data-id={selectedId}
            on:click={() => (recentsClicked = !recentsClicked)}
        >
            {selectedName}
            <button class="done-button btn">{@html doneIcon}</button>
            {#if recentsClicked}
                <div class="recents">
                    {#if $recents}
                        {#each $recents as recent}
                            <button
                                class="recent"
                                data-id={recent.id}
                                on:click={() => {
                                    selectedId = recent.id;
                                    selectedName = recent.name;
                                    recentsClicked = false;
                                }}>{recent.name}</button
                            >
                        {/each}
                    {/if}
                </div>
            {/if}
        </button>
    </div>
</div>

<style>
    .move {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: grid;
        place-content: center;
        color: var(--color-white);
        background-color: var(--primary-backdrop-color);
        backdrop-filter: blur(3rem);
        -webkit-backdrop-filter: blur(3rem);
        z-index: 3;
        user-select: none;
    }
    .selection {
        position: relative;
        background-color: var(--primary-backdrop-color);
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        max-width: fit-content;
        /* gap: 1rem; */
    }
    button {
        text-align: start;
        cursor: pointer;
    }
    .selected,
    .recents {
        filter: none;
        background-color: #555;
        width: 25rem;
        cursor: pointer;
        border-radius: 0.5rem;
    }
    .done-button {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translate(0%, -50%);
    }
    .selected {
        padding: 1rem;
        position: relative;
    }
    .recents {
        position: absolute;
        top: 4rem;
        left: 0rem;
        display: flex;
        flex-flow: column;
    }
    .recent {
        padding: 0.5rem 1rem;
    }
    .recent:hover {
        filter: none;
        background-color: #666;
    }
</style>
