<script lang="ts">
    import { goto } from "$app/navigation";
    import { previewItem, renameValue, renameid } from "$lib/scripts/utils";
    import DirCover from "./DirCover.svelte";

    export let dir: GoogleFile;
    let dirName = dir.name;
    function dirNavigate(e) {
        $previewItem = undefined;
        goto(`/${dir.id}`);
    }
    $: dir.id === $renameid && (dirName = $renameValue);
    console.log(dirName);
</script>

<div class="dir-card" data-id={dir.id}>
    <button on:click={dirNavigate}>
        <DirCover id={dir.id} name={dirName} on:editDir on:deleteDir />
    </button>
    <h2 class="dir-title">{dir.name}</h2>
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
