<script lang="ts">
    import { updateResource } from "$lib/scripts/drive";
    import favoriteIcon from "$lib/assets/favorite.svg?raw";
    import { createEventDispatcher } from "svelte";

    export let id: string;
    export let starred: Boolean;

    const dispatch = createEventDispatcher();
    function favStatus() {
        dispatch("favStatus");
    }
</script>

<button
    class="btn {starred && 'starred'}"
    on:click|stopPropagation={() => {
        updateResource(
            id,
            { starred: !starred },
            window.localStorage.getItem("token")
        ).then(({ status }) => {
            if (status === 200) favStatus();
        });
    }}
>
    {@html favoriteIcon}
</button>

<style>
    .btn {
        filter: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        display: block;
    }
    .btn :global(svg) {
        stroke: var(--color-black);
        stroke-width: 2rem;
        fill: var(--color-white-level-one);
    }
    .starred :global(svg) {
        fill: red;
    }
</style>
