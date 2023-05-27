<script lang="ts">
    import DirCard from "$lib/components/dirs/DirCard.svelte";

    export let dirs: GoogleFile[];
</script>

<div class="dirs">
    {#each dirs as dir}
        {#key dir.id}
            <DirCard {dir} on:editDir on:deleteDir />
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
