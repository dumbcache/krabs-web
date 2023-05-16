<script lang="ts">
    import imgCreate from "$lib/assets/imgCreate.svg?raw";
    import folderCreate from "$lib/assets/folderCreate.svg?raw";
    import refresh from "$lib/assets/refresh.svg?raw";
    import { activeParent, imgPickerHandler } from "$lib/scripts/utils";
    import DirCreate from "./DirCreate.svelte";
    import { refreshMainContent } from "$lib/scripts/drive";

    let dirCreateToggle = false;
    let refreshClicked = false;
</script>

<div class="tools">
    <button
        class="refresh-button btn {refreshClicked ? 'anime' : ''}"
        title="refresh cache"
        on:click={() => {
            refreshClicked = true;
            refreshMainContent($activeParent);
        }}
    >
        {@html refresh}
    </button>
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
    {#if dirCreateToggle}
        <DirCreate on:dirCreateClose={() => (dirCreateToggle = false)} />
    {/if}
</div>

<style>
    .tools {
        display: flex;
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
</style>
