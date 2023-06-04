<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import closeIcon from "$lib/assets/close.svg?raw";
    import doneIcon from "$lib/assets/done.svg?raw";
    import clearIcon from "$lib/assets/clear.svg?raw";
    import doubleRightIcon from "$lib/assets/doubleRight.svg?raw";
    import {
        dropOkHandler,
        // clearDropItems,
    } from "$lib/scripts/utils";
    import { dropItems, dropMini } from "$lib/scripts/stores";

    export function clearDropItems() {
        const a = $dropItems.filter((item) => item.progress !== "success");
        dropItems.set(a);
    }
</script>

<div class="drop-tools">
    <span>
        <button
            class="drop-cancel btn"
            title="close"
            on:click={() => ($dropItems = [])}
        >
            {@html closeIcon}
        </button>
        <button
            class="btn"
            title="minimize to right"
            on:click={() => ($dropMini = !$dropMini)}
        >
            {@html doubleRightIcon}
        </button>
        <button class="btn" title="clear completed" on:click={clearDropItems}>
            {@html clearIcon}
        </button>
    </span>
    <!-- <span class="drop-parent">parent</span> -->
    <input type="text" class="common-url" placeholder="common-url" value="" />
    <button class="drop-ok btn" on:click={dropOkHandler}>
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
    .btn {
        width: var(--secondary-icon-size);
        height: var(--secondary-icon-size);
    }
    @media (max-width: 600px) {
        .common-url {
            max-width: 15rem;
        }
    }
</style>
