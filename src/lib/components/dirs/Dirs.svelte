<script lang="ts">
    import DirCard from "$lib/components/dirs/DirCard.svelte";
    import { activeDirs } from "$lib/scripts/stores";

    export let dirs: GoogleFile[];
</script>

<div class="dirs">
    {#if dirs}
        {#each dirs as dir}
            {#key dir.id}
                <DirCard {dir} on:editDir on:deleteDir />
            {/key}
        {/each}
    {/if}
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
