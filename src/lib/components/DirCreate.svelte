<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import doneIcon from "$lib/assets/done.svg?raw";
    import { activeParent } from "$lib/scripts/utils";
    import { createDir } from "$lib/scripts/drive";

    let dirName = "";

    const dispatch = createEventDispatcher();
    function dispatchClose() {
        dispatch("dirCreateClose");
    }
    async function createDirHandler() {
        const token = window.localStorage.getItem("token")!;
        dirName = dirName
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        if (await createDir(dirName, $activeParent, token)) dispatchClose();
    }
</script>

<form
    class="create"
    on:click={dispatchClose}
    on:keypress|stopPropagation
    on:submit|preventDefault={createDirHandler}
>
    <label
        class="wrapper"
        for="dir-name"
        on:click|stopPropagation
        on:keypress|stopPropagation
    >
        <input
            type="text"
            id="dir-name"
            placeholder="Directory Name"
            bind:value={dirName}
            autofocus
            on:click|stopPropagation
        />
        <button
            type="submit"
            class="btn"
            disabled={dirName.trim() === "" ? true : false}
            >{@html doneIcon}</button
        >
    </label>
</form>

<style>
    .create {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        display: grid;
        place-content: center;
        background-color: var(--primary-backdrop-color);
        backdrop-filter: blur(1rem);
        -webkit-backdrop-filter: blur(1rem);
        z-index: 2;
    }
    .btn:disabled {
        cursor: not-allowed;
    }
    .btn:disabled :global(svg) {
        fill: red;
    }
    .wrapper {
        max-width: 30rem;
        padding: 5rem 4rem;
        background-color: var(--primary-backdrop-color);
        border-radius: 1rem;
        display: flex;
        gap: 1rem;
        box-shadow: 0 0 1px 1px #fff3;
        justify-content: space-evenly;
        align-items: center;
    }
    input {
        padding: 0.5rem;
        max-width: 70%;
        border-radius: 0.5rem;
        border: none;
        outline: none;
        background-color: var(--color-black-level-four);
        color: var(--color-white-level-two);
    }

    .btn :global(svg) {
        fill: #0f0;
    }
    @media (max-width: 600px) {
        .wrapper {
            max-width: 70%;
            margin: auto;
            padding: 3rem;
        }
        input {
            max-width: 80%;
        }
    }
</style>
