<script lang="ts">
    import { newCreatedDir } from "$lib/scripts/utils";
    import DirCard from "./DirCard.svelte";

    export let dirs: GoogleFile[];
    $: if ($newCreatedDir) {
        dirs = [$newCreatedDir as GoogleFile, ...dirs];
    }
</script>

<div class="dirs">
    {#each dirs as dir}
        {#key dir.id}
            <DirCard {dir} />
        {/key}
    {/each}
</div>

<style>
    .dirs {
        display: flex;
        flex-flow: row wrap;
        gap: var(--content-gap);
        padding: var(--content-padding);
        justify-content: center;
    }
</style>
