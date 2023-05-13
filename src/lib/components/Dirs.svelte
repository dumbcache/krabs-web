<script lang="ts">
    import DirCard from "./DirCard.svelte";

    export let dirs: GoogleFile[];
</script>

<div class="dirs">
    {#each dirs as dir}
        <DirCard {dir} />
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
