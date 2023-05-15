<script lang="ts">
    import closeIcon from "$lib/assets/close.svg?raw";
    import doneIcon from "$lib/assets/done.svg?raw";
    import doubleRightIcon from "$lib/assets/doubleRight.svg?raw";
    import { dropItems } from "$lib/scripts/utils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    function toggleMini() {
        dispatch("toggleMini");
    }
</script>

<div class="drop-tools">
    <span>
        <button class="drop-cancel btn" on:click={() => ($dropItems = [])}>
            {@html closeIcon}
        </button>
        <button class="btn" on:click={toggleMini}>
            {@html doubleRightIcon}
        </button>
    </span>
    <span class="drop-parent">parent</span>
    <input type="text" class="common-url" placeholder="common-url" value="" />
    <button class="drop-ok btn">
        {@html doneIcon}
    </button>
</div>

<style>
    .drop-tools {
        position: sticky;
        top: 0;
        background-color: inherit;
        display: flex;
        align-items: center;
        padding: 1rem 0rem;
        justify-content: space-between;
        justify-self: start;
        /* background-color: #eee; */
        z-index: 1;
    }

    .common-url {
        max-width: 20rem;
    }
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
</style>
