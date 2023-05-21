<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        activeParentName,
        previewItem,
        renameValue,
        renameid,
    } from "$lib/scripts/utils";
    import DirCover from "./DirCover.svelte";

    export let dir: GoogleFile;

    function dirNavigate(e) {
        $previewItem = undefined;
        goto(`/${dir.id}`);
    }
</script>

<div class="dir-card" data-id={dir.id}>
    <button on:click={dirNavigate}>
        <DirCover id={dir.id} name={dir.name} on:editDir on:deleteDir />
    </button>
    <h2 class="dir-title">{$renameid === dir.id ? $renameValue : dir.name}</h2>
</div>

<style>
    .dir-card {
        position: relative;
    }
    button {
        filter: none;
    }
    .dir-card {
        width: var(--dir-width);
    }
</style>
