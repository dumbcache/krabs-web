<script lang="ts">
    import doneIcon from "$lib/assets/done.svg?raw";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    function dispatchClose(ctx: string, detail?: any) {
        dispatch(ctx, detail);
    }
</script>

<div
    class="confirm"
    on:click={() => dispatch("confirmCloseNO")}
    on:keydown|preventDefault
>
    <div class="wrapper" on:click|preventDefault on:keydown|preventDefault>
        <p>Sure you want to delete?</p>
        <button class="btn" on:click={() => dispatchClose("confirmCloseOK")}
            >{@html doneIcon}</button
        >
    </div>
</div>

<style>
    .confirm {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: grid;
        place-content: center;
        background-color: var(--primary-backdrop-color);
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
        z-index: 2;
    }
    .btn :global(svg) {
        fill: #0f0;
    }
    .wrapper {
        background-color: var(--primary-backdrop-color);
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }
</style>
