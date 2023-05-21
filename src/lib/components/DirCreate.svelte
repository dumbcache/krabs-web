<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import doneIcon from "$lib/assets/done.svg?raw";
    import { activeParent, renameValue, renameid } from "$lib/scripts/utils";
    import { createDir, updateDir, deleteDir } from "$lib/scripts/drive";

    const confirmText = "type 'confirm'";
    export let type: "create" | "update" | "delete";
    export let id = "";
    export let name = "";
    let placeholder = name || "";
    let submitDisabled = true;
    let confirmationVisible = false;
    let inputVisible = true;
    if (type === "delete") {
        inputVisible = false;
        confirmationVisible = true;
    }

    const dispatch = createEventDispatcher();
    function dispatchClose(ctx: string, detail?: any) {
        dispatch(ctx, detail);
    }
    async function dirActionHandler() {
        const token = window.localStorage.getItem("token")!;
        let dirName = placeholder
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        placeholder = dirName;
        if (type === "create") {
            await createDir(dirName, $activeParent, token);
            dispatchClose("dirCreateClose");
        }
        if (type === "update") {
            const data = await updateDir(dirName, id, $activeParent, token);
            $renameValue = data.name;
            $renameid = data.id;
            dispatchClose("dirUpdateClose");
        }
        if (type === "delete") {
            await deleteDir(id, $activeParent, token);
            dispatchClose("dirDeleteClose");
        }
    }
    function checkDisabled() {
        if (type === "delete") {
            placeholder.trim() !== "confirm"
                ? (submitDisabled = true)
                : (submitDisabled = false);
        } else {
            placeholder.trim() === ""
                ? (submitDisabled = true)
                : (submitDisabled = false);
        }
    }
</script>

<form
    class="create"
    on:click={() =>
        dispatchClose(type === "create" ? "dirCreateClose" : "dirUpdateClose")}
    on:keypress|stopPropagation
    on:submit|preventDefault={dirActionHandler}
>
    {#if confirmationVisible}
        <div class="wrapper">
            All files and subfolders will be deleted. You alright in Mind?
            <button
                type="button"
                class="btn"
                on:click|stopPropagation={() => {
                    confirmationVisible = false;
                    inputVisible = true;
                }}>{@html doneIcon}</button
            >
        </div>
    {/if}
    {#if inputVisible}
        <label
            class="wrapper"
            for="dir-name"
            on:click|stopPropagation
            on:keypress|stopPropagation
        >
            <input
                type="text"
                id="dir-name"
                placeholder={type === "delete" ? confirmText : "Directory Name"}
                bind:value={placeholder}
                autofocus
                on:click|stopPropagation
                on:input={checkDisabled}
                autocomplete="off"
            />
            <button type="submit" class="btn" disabled={submitDisabled}
                >{@html doneIcon}</button
            >
        </label>
    {/if}
</form>

<style>
    .create {
        color: var(--color-white-level-two);
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
        min-width: var(--primary-icon-size);
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
