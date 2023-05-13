<script lang="ts">
    import { goto } from "$app/navigation";
    import DirCover from "./DirCover.svelte";

    export let dir: GoogleFile;
</script>

<div class="dir-card">
    <a href={`/${dir.id}`}>
        <DirCover id={dir.id} />
    </a>
    <h2 class="dir-title">{dir.name}</h2>
</div>

<style>
    .dir-card {
        width: var(--dir-width);
    }
</style>
