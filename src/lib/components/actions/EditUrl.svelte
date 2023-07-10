<script lang="ts">
    import doneIcon from "$lib/assets/done.svg?raw";
    import progressIcon from "$lib/assets/progress.svg?raw";
    import { editItems, mode } from "$lib/scripts/stores";
    import { childWorker } from "$lib/scripts/utils";
    import { onMount } from "svelte";
    import Confirm from "./Confirm.svelte";

    let progress = false;
    let editConfirm = false;
    let urlField: HTMLInputElement;
    let urlValue = "";
    const token = window.localStorage.getItem("token");
    onMount(() => {
        urlField.focus();
        setTimeout(() => {
            urlValue = "";
        }, 0);
    });
</script>

{#if !editConfirm}
    <div
        class="edit-url"
        on:keydown={() => {}}
        on:click={() => progress || ($mode = "select")}
    >
        <form
            class="wrapper"
            on:click|stopPropagation
            on:keydown={() => {}}
            on:submit|preventDefault={() => (editConfirm = true)}
        >
            <input
                type="text"
                class="url"
                placeholder="enter new url"
                bind:value={urlValue}
                bind:this={urlField}
                on:keydown|stopPropagation
            />
            {#if !progress}
                <button
                    type="submit"
                    class="done-button btn"
                    disabled={urlValue.trim() === ""}>{@html doneIcon}</button
                >
            {/if}
            {#if progress}
                <button class="progress-button btn">{@html progressIcon}</button
                >
            {/if}
        </form>
    </div>
{:else}
    <Confirm
        text={"you sure want to update?"}
        on:confirmCloseNO={() => {
            editConfirm = false;
        }}
        on:confirmCloseOK={() => {
            progress = true;
            editConfirm = false;
            childWorker.postMessage({
                context: "EDIT_IMGS",
                url: urlValue,
                imgs: $editItems,
                token,
            });
        }}
    />
{/if}

<style>
    .edit-url {
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
        user-select: none;
    }
    .wrapper {
        background-color: var(--primary-backdrop-color);
        padding: 2rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        position: relative;
        max-width: 30rem;
        gap: 1rem;
    }

    button {
        text-align: start;
        cursor: pointer;
    }

    .done-button:disabled {
        cursor: not-allowed;
        filter: invert(0.5);
    }
    .done-button:disabled :global(svg) {
        cursor: not-allowed;
    }
    .url {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-shrink: 2;
        max-width: 25rem;
        border: none;
        outline: none;
        padding: 0.5rem;
        font-size: 1.6rem;
        color: var(--primary-color);
        background-color: var(--input-background);
        border-bottom: 2px solid var(--color-black);
        border-radius: 0.5rem;
        padding-left: 0.5rem;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .progress-button {
        -webkit-animation: spin 1.5s linear 0s infinite;
        animation: spin 1s linear 0s infinite;
    }
    .done-button:hover :global(svg) {
        fill: #3af;
    }
    .done-button :global(svg) {
        fill: #0ff;
    }
</style>
