<script lang="ts">
    import linkIcon from "$lib/assets/link.svg?raw";
    import { previewItem } from "$lib/scripts/utils";
    export let img: GoogleFile;

    function handleImgclick() {
        if ($previewItem?.id !== img.id) {
            $previewItem = { id: img.id, src: img.thumbnailLink! };
        }
    }
</script>

<div
    class="img-card"
    data-id={img.id}
    on:click={handleImgclick}
    on:keypress={handleImgclick}
>
    <img
        src={img.thumbnailLink}
        alt="thumbnail to link"
        referrerpolicy="no-referrer"
        class="img"
        loading="lazy"
        height="200"
        width="200"
    />
    <button class="anchor">.</button>
    <a
        href={img.appProperties?.origin || ""}
        class="img-link"
        target="_blank"
        rel="external noopener noreferrer nofollow"
        on:click|stopPropagation
    >
        {@html linkIcon}
    </a>
</div>

<style>
    .img-card {
        position: relative;
        background-color: var(--content-background-color);
        border-radius: 1rem;
        height: fit-content;
        border: none;
    }
    .img-card:hover .img {
        filter: brightness(0.5);
    }
    .img-card:hover .img-link :global(svg) {
        opacity: 1;
    }

    .img-link {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        max-width: fit-content;
    }
    .img-link :global(svg) {
        opacity: 0;
        width: var(--primary-icon-size);
        height: var(--primary-icon-size);
        transition: opacity 0.3s linear;
        fill: var(--color-white);
        filter: none;
    }

    .img {
        display: block;
        overflow: hidden;
        height: fit-content;
        max-width: var(--img-width);
        border-radius: 1rem;
        border: none;
    }
    .img:hover {
        cursor: zoom-in;
    }
    .anchor {
        display: inline-block;
        height: 5px;
        /* width: 2px; */
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }

    @media (max-width: 600px) {
        .img-link :global(svg) {
            opacity: unset;
        }
    }
</style>
