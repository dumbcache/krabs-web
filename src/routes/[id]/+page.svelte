<script lang="ts">
    import Dirs from "$lib/components/Dirs.svelte";
    import Imgs from "$lib/components/Imgs.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

{#if data.dirs?.files.length !== 0 || data.imgs?.files.length !== 0}
    {#if data.dirs?.files}
        <Dirs dirs={data.dirs?.files} />
    {/if}
    {#if data.imgs?.files}
        <Imgs imgs={data.imgs.files} />
    {/if}
{:else}
    <p>No Files</p>
{/if}

<style>
    p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
