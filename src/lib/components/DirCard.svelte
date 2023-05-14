<script lang="ts">
    import { goto } from "$app/navigation";
    import DirCover from "./DirCover.svelte";

    export let dir: GoogleFile;
    function dirNavigate(e) {
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
