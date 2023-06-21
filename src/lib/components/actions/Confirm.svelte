<script lang="ts">
    import doneIcon from "$lib/assets/done.svg?raw";
    import closeIcon from "$lib/assets/close.svg?raw";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    function dispatchClose(ctx: string, detail?: any) {
        dispatch(ctx, detail);
    }

    export let text: string;
    export let closeOnClick: Boolean = true;
</script>

<div
    class="confirm"
    on:click={() => closeOnClick && dispatch("confirmCloseNO")}
    on:keydown|stopPropagation
>
    <div class="wrapper" on:click|stopPropagation on:keydown|stopPropagation>
        <p>{text}</p>
        <span>
            <button
                class="btn close"
                on:click={() => dispatchClose("confirmCloseNO")}
                >{@html closeIcon}</button
            >
            <button
                class="btn ok"
                on:click={() => dispatchClose("confirmCloseOK")}
                >{@html doneIcon}</button
            >
        </span>
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
        color: var(--color-white);
        background-color: var(--primary-backdrop-color);
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
        z-index: 3;
    }
    .ok :global(svg) {
        fill: #0f0;
    }
    .close :global(svg) {
        fill: #f00;
    }
    .wrapper {
        background-color: var(--primary-backdrop-color);
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        flex-flow: column;
        gap: 1rem;
    }
    span {
        display: flex;
        justify-content: space-evenly;
    }
</style>
