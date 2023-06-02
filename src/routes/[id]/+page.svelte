<script lang="ts">
    import Dirs from "$lib/components/dirs/Dirs.svelte";
    import Imgs from "$lib/components/imgs/Imgs.svelte";
    import type { PageData } from "./$types";
    import DirCreate from "$lib/components/actions/DirCreate.svelte";
    import { onMount } from "svelte";
    import { FILE_API } from "$lib/scripts/drive";
    import { childWorker, getToken } from "$lib/scripts/utils";
    import {
        activeParentId,
        activeParentName,
        editItems,
        editMode,
        selectedCount,
    } from "$lib/scripts/stores";
    import doneIcon from "$lib/assets/done.svg?raw";
    import closeIcon from "$lib/assets/close.svg?raw";

    export let data: PageData;

    let type: "update" | "delete";
    let dirToggle = false;
    let activeId = "";
    let activeName = "";
    onMount(() => {
        async function getParentName() {
            let res = await fetch(
                `${FILE_API}/${$activeParentId}?fields=name`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${window.localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (res.status !== 200) {
                console.log(await res.text());
                if (res.status === 401) {
                    getToken();
                    getParentName();
                }
                return;
            }
            const { name } = await res.json();
            $activeParentName = name;
        }
        getParentName();
    });
</script>

{#if data.dirs?.files.length !== 0 || data.imgs?.files.length !== 0}
    {#if $editMode === "delete"}
        <div class="edit-mode">
            <p>seleted : {$selectedCount}</p>
            <button
                class="btn"
                disabled={$selectedCount === 0}
                on:click={() => {
                    childWorker.postMessage({
                        context: "IMG_DELETE",
                        imgs: $editItems,
                        token: window.localStorage.getItem("token"),
                    });
                    console.log($editItems);
                }}>{@html doneIcon}</button
            >
            <button
                class="btn"
                on:click={() => {
                    $editMode = "";
                    $selectedCount = 0;
                    $editItems = [];
                }}>{@html closeIcon}</button
            >
        </div>
        {#if data.imgs?.files.length !== 0}
            <Imgs imgs={data.imgs.files} />
        {/if}
    {:else}
        {#if data.dirs?.files.length !== 0}
            <Dirs
                dirs={data.dirs?.files}
                on:editDir={(e) => {
                    activeId = e.detail.id;
                    activeName = e.detail.name;
                    dirToggle = true;
                    type = "update";
                }}
                on:deleteDir={(e) => {
                    activeId = e.detail.id;
                    dirToggle = true;
                    type = "delete";
                }}
            />
        {/if}

        {#if data.imgs?.files.length !== 0}
            <Imgs imgs={data.imgs.files} />
        {/if}
    {/if}
{:else}
    <p class="no-files">No Files</p>
{/if}
{#if dirToggle}
    <DirCreate
        {type}
        id={activeId}
        name={type !== "delete" ? activeName : ""}
        on:dirUpdateClose={() => (dirToggle = false)}
        on:dirDeleteClose={() => (dirToggle = false)}
    />
{/if}

<style>
    .no-files {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .edit-mode {
        position: sticky;
        top: 1.5rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        width: fit-content;
        margin-left: auto;
        margin-right: 5rem;
        z-index: 1;
    }

    .btn:disabled {
        cursor: not-allowed;
    }
    @media (max-width: 600px) {
        .edit-mode {
            top: 5rem;
            margin-right: 1rem;
        }
    }
</style>
