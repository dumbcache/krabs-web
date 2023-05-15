<script lang="ts">
    import { goto } from "$app/navigation";
    import { previewItem } from "$lib/scripts/utils";
    import DirCover from "./DirCover.svelte";

    export let dir: GoogleFile;
    function dirNavigate(e) {
        $previewItem = undefined;
        goto(`/${dir.id}`);
    }
</script>

<div class="dir-card">
    <button on:click={dirNavigate}>
        <DirCover id={dir.id} />
    </button>
    <h2 class="dir-title">{dir.name}</h2>
</div>

<style>
    button {
        filter: none;
    }
    .dir-card {
        width: var(--dir-width);
    }
</style>
