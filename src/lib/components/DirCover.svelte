<script lang="ts">
    import { fetchFiles } from "$lib/scripts/drive";

    export let id: string;
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
            <img
                src={pic.thumbnailLink}
                alt="cover pic"
                referrerpolicy="no-referrer"
            />
        {/each}
    {/if}
</div>

<style>
    .cover {
        border: 1px solid #000;
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
        gap: 1px;
        background-color: var(--content-background-color);
    }

    .cover:hover {
        filter: brightness(0.5);
        cursor: pointer;
    }
    .cover img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top;
        border: none;
    }

    .cover img:nth-child(1) {
        grid-area: one;
    }
    .cover img:nth-child(2) {
        grid-area: two;
    }
    .cover img:nth-child(3) {
        grid-area: three;
    }
</style>
