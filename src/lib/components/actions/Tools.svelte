<script lang="ts">
    import imgCreate from "$lib/assets/imgCreate.svg?raw";
    import folderCreate from "$lib/assets/folderCreate.svg?raw";
    import refresh from "$lib/assets/refresh.svg?raw";
    import { previewAndSetDropItems } from "$lib/scripts/utils";
    import { activeParentId, previewItem } from "$lib/scripts/stores";
    import DirCreate from "$lib/components/actions/DirCreate.svelte";
    import { refreshCache, refreshMainContent } from "$lib/scripts/drive";
    import EditIcon from "./EditIcon.svelte";
    import History from "./History.svelte";

    let dirCreateToggle = false;
    let refreshClicked = false;
    function imgPickerHandler(e: InputEvent) {
        e.preventDefault();
        // clearDropItems();
        const target = e.target as HTMLInputElement;
        previewItem.set(undefined);
        if (target.files) {
            previewAndSetDropItems(target.files);
        }
    }
</script>

<div class="tools">
    <History />
    <EditIcon />
    <label for="img-picker" class="button__create-img btn" title="add image">
        {@html imgCreate}
    </label>
    <input
        type="file"
        name="img-picker"
        id="img-picker"
        accept="image/*"
        multiple
        on:change={imgPickerHandler}
    />
    <button
        class="button__create-folder btn"
        title="add directory"
        on:click={() => (dirCreateToggle = !dirCreateToggle)}
    >
        {@html folderCreate}
    </button>
    <button
        class="refresh-button btn {refreshClicked ? 'anime' : ''}"
        title="refresh cache"
        on:click={() => {
            refreshClicked = true;
            refreshCache();
        }}
    >
        {@html refresh}
    </button>

    {#if dirCreateToggle}
        <DirCreate
            type="create"
            on:dirCreateClose={() => (dirCreateToggle = false)}
        />
    {/if}
</div>

<style>
    .tools {
        display: flex;
        flex-flow: column nowrap;
        gap: 1rem;
    }
    #img-picker {
        display: none;
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
    .anime {
        -webkit-animation: spin 1.5s linear 0s infinite;
        animation: spin 1s linear 0s infinite;
    }
    @media (max-width: 600px) {
        .tools {
            flex-flow: row nowrap;
        }
    }
</style>
