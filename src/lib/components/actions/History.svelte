<script lang="ts">
    import historyIcon from "$lib/assets/history.svg?raw";
    import { goto } from "$app/navigation";
    import { recents, previewItem } from "$lib/scripts/stores";

    function dirNavigate(e) {
        $previewItem = undefined;
        goto(`/${e.target.dataset.id}`);
    }
</script>

<div class="history">
    <button class="history-button btn">
        {@html historyIcon}
    </button>
    <div class="wrapper">
        {#if $recents}
            <div class="list">
                {#each $recents as recent}
                    <button
                        class="recent"
                        data-id={recent.id}
                        on:click={dirNavigate}>{recent.name}</button
                    >
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .history {
        position: relative;
    }
    .wrapper {
        display: none;
        position: absolute;
        padding-left: 1rem;
        top: 0;
    }
    .list {
        background-color: var(--primary-bg-color);
        box-shadow: 0 0 1px 1px var(--primary-color);
        border-radius: 1rem;
        overflow: hidden;
    }
    .recent {
        padding: 0.5rem;
        width: 20rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        filter: none;
        border-bottom: 1px solid var(--cover-border-color);
        text-align: start;
    }
    .recent:hover {
        background-color: var(--cover-border-color);
    }
    .history:hover .wrapper {
        display: initial;
    }
    @media (max-width: 600px) {
        .wrapper {
            top: 2rem;
            right: 0;
        }
        .list {
            width: 15rem;
        }
        .recent {
            font-size: 1.3rem;
        }
    }
</style>
