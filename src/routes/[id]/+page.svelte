<script lang="ts">
    import Dirs from "$lib/components/dirs/Dirs.svelte";
    import Imgs from "$lib/components/imgs/Imgs.svelte";
    import DirCreate from "$lib/components/actions/DirCreate.svelte";
    import { onDestroy, onMount } from "svelte";
    import { FILE_API } from "$lib/scripts/drive";
    import { childWorker, getToken } from "$lib/scripts/utils";
    import {
        activeParentId,
        activeParentName,
        editItems,
        selectedCount,
        activeDirs,
        activeImgs,
        previewItem,
        editConfirm,
        searchItems,
        mode,
        isLoggedin,
        editMode,
    } from "$lib/scripts/stores";
    import deleteIcon from "$lib/assets/delete.svg?raw";
    import closeIcon from "$lib/assets/close.svg?raw";
    import moveIcon from "$lib/assets/move.svg?raw";
    import editIcon from "$lib/assets/edit.svg?raw";
    import selectallIcon from "$lib/assets/selectall.svg?raw";
    import Confirm from "$lib/components/actions/Confirm.svelte";

    let type: "update" | "delete";
    let dirToggle = false;
    let activeId = "";
    let activeName = "";
    let contentHidden: string;
    $: contentHidden =
        $mode === "delete" ? "none" : $mode === "search" ? "none" : "initial";

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
                }
                return;
            }
            const { name } = await res.json();
            $activeParentName = name;
        }
        if ($isLoggedin) {
            getParentName();
        }
    });
    onDestroy(() => {
        $previewItem = undefined;
        $mode = "";
    });
</script>

{#if $activeDirs?.length !== 0 || $activeImgs?.length !== 0}
    {#if $editMode}
        <div class="edit-mode">
            <p>seleted : {$selectedCount}</p>
            <div class="edit-buttons">
                <button
                    class="delelte-button btn"
                    title="select all"
                    on:click={() => {}}>{@html selectallIcon}</button
                >
                <button class="btn" title="move" on:click={() => {}}
                    >{@html editIcon}</button
                >
                <button class="btn" title="move" on:click={() => {}}
                    >{@html moveIcon}</button
                >
                <button
                    class="delelte-button btn"
                    disabled={$selectedCount === 0}
                    title="delete"
                    on:click={() => {
                        // $mode = "delete";
                        $editConfirm = true;
                    }}>{@html deleteIcon}</button
                >
                <button
                    class="btn"
                    title="close"
                    on:click={() => {
                        $mode = "";
                        $editMode = false;
                        $selectedCount = 0;
                        $editItems = [];
                    }}>{@html closeIcon}</button
                >
            </div>
        </div>
        {#if $activeImgs?.length !== 0}
            <Imgs imgs={$activeImgs} />
        {/if}
    {/if}
    {#if $mode === "search"}
        {#if $searchItems?.length !== 0}
            <Dirs dirs={$searchItems} />
        {/if}
    {/if}
    <div style:display={contentHidden}>
        <div class="count">
            {#if $activeImgs?.length !== 0 && $activeImgs !== undefined}
                <span>Images: {$activeImgs?.length}</span>
            {/if}
            {#if $activeDirs?.length !== 0 && $activeDirs !== undefined}
                <span>Folders: {$activeDirs?.length}</span>
            {/if}
        </div>
        {#if $activeDirs?.length !== 0}
            <Dirs
                dirs={$activeDirs}
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
        <Imgs imgs={$activeImgs} />
    </div>
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
{#if $editConfirm}
    <Confirm
        text={"Sure you want to delete?"}
        on:confirmCloseNO={() => {
            // $editMode = "";
            // $selectedCount = 0;
            // $editItems = [];
            $editConfirm = false;
        }}
        on:confirmCloseOK={() => {
            childWorker.postMessage({
                context: "IMG_DELETE",
                imgs: $editItems,
                token: window.localStorage.getItem("token"),
            });
            $editConfirm = false;
        }}
    />
{/if}

<style>
    .count {
        display: flex;
        gap: 2rem;
        width: fit-content;
        margin-left: auto;
        margin-right: 3rem;
    }
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
        justify-content: space-between;
        gap: 2rem;
        padding: 0rem 5rem;
        /* width: fit-content;
        margin-left: auto;
        margin-right: 5rem; */
        z-index: 1;
    }
    .edit-buttons {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .btn:disabled :global(svg),
    .btn:disabled {
        cursor: not-allowed;
    }
    @media (max-width: 600px) {
        .count {
            margin-right: 1rem;
            font-size: 1.3rem;
        }
        .edit-mode {
            padding: 0rem 1rem;
            top: 4.5rem;
        }
        .edit-buttons {
            gap: 1.5rem;
        }
    }
</style>
