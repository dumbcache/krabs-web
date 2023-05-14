<script lang="ts">
    import linkIcon from "$lib/assets/link.svg?raw";
    export let img: GoogleFile;
</script>

<div class="img-card">
    <img
        src={img.thumbnailLink}
        alt="thumbnail to link"
        referrerpolicy="no-referrer"
        class="img"
        data-id={img.id}
        loading="lazy"
        height="200"
        width="200"
    />
    <a
        href={img.appProperties?.origin || ""}
        class="img-link"
        target="_blank"
        rel="external noopener noreferrer nofollow"
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
    @media (max-width: 600px) {
        .img-link :global(svg) {
            opacity: unset;
        }
    }
</style>
