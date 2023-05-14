<script>
    import {
        handleTouchEnd,
        handleTouchStart,
        previewItem,
    } from "$lib/scripts/utils";
</script>

{#if $previewItem}
    <div
        class="preview"
        data-id={$previewItem.id}
        on:touchstart={handleTouchStart}
        on:touchend={(e) => handleTouchEnd(e, $previewItem.id)}
    >
        <img src={`${$previewItem.src}`} alt="" class="preview-img" />
    </div>
{/if}

<style>
    .preview-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: top;
    }
</style>
