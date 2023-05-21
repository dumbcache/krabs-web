<script lang="ts">
    import { fetchFiles } from "$lib/scripts/drive";
    import EditTool from "./EditTool.svelte";

    export let id: string;
    export let name: string;
    let pics: GoogleFile[] = [];

    $: (fetchFiles(id, "covers", 3) as Promise<GoogleFileRes>).then(
        ({ files }) => {
            pics = files;
        }
    );
</script>

<div class="cover">
    {#if pics.length != 0}
        {#each pics as pic}
            <div class="pic-wrapper">
                <img
                    src={pic.thumbnailLink}
                    alt="cover pic"
                    referrerpolicy="no-referrer"
                    on:load={(e) => (e.target.style.display = "initial")}
                    on:error={(e) => (e.target.style.display = "none")}
                />
            </div>
        {/each}
    {:else}
        <div class="pic-wrapper" />
        <div class="pic-wrapper" />
        <div class="pic-wrapper" />
    {/if}
    <EditTool type="dir" {id} {name} on:editDir on:deleteDir />
</div>

<style>
    .pic-wrapper {
        /* background-color: var(--cover-background-color); */
    }
    .cover {
        border: 1px solid var(--cover-border-color);
        background-color: var(--cover-background-color);
        width: var(--dir-width);
        height: var(--cover-height);
        display: grid;
        grid-template-rows: 60% 40%;
        grid-template-columns: 70% 30%;
        grid-template-areas:
            "one two"
            "one three";
        border-radius: 1rem;
        overflow: hidden;
        /* background-color: var(--content-background-color); */
        cursor: pointer;
    }

    /* .cover:hover {
        background-color: var(--content-background-color-hover);
    } */
    .cover:hover .pic-wrapper {
        filter: brightness(0.5);
    }
    .cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border: none;
        display: none;
    }

    .cover .pic-wrapper:nth-child(1) {
        grid-area: one;
        border-right: 1px solid var(--cover-border-color);
    }
    .cover .pic-wrapper:nth-child(2) {
        grid-area: two;
        border-bottom: 1px solid var(--cover-border-color);
    }
    .cover .pic-wrapper:nth-child(3) {
        grid-area: three;
    }
</style>
