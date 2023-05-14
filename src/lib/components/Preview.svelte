<script>
    import { fade } from "svelte/transition";
    import {
        handleTouchEnd,
        handleTouchMove,
        handleTouchStart,
        previewChange,
        previewItem,
        previewShortcutHandler,
    } from "$lib/scripts/utils";
    import closeIcon from "$lib/assets/close.svg?raw";
    import beforeIcon from "$lib/assets/beforeNavigate.svg?raw";
    import nextIcon from "$lib/assets/nextNavigate.svg?raw";
    import expandIcon from "$lib/assets/expand.svg?raw";
    let fullMode = false;
</script>

<svelte:window
    on:keydown={(e) => previewShortcutHandler(e, $previewItem?.id)}
/>
{#if $previewItem}
    <div
        class="preview {fullMode ? 'preview-full' : 'preview-half'}"
        on:touchstart={handleTouchStart}
        on:touchend={(e) => handleTouchEnd(e, $previewItem.id)}
        on:touchmove={handleTouchMove}
        transition:fade={{ duration: 200 }}
    >
        <img
            src={`${$previewItem.url || $previewItem.src}`}
            data-id={$previewItem.id}
            alt=""
            class="preview-img"
        />
        <div class="preview-tools">
            <button
                class="close btn"
                on:click={() => ($previewItem = undefined)}
            >
                {@html closeIcon}
            </button>
            <button
                class="before btn"
                on:click={() => previewChange($previewItem.id, "PREV")}
            >
                {@html beforeIcon}
            </button>
            <button
                class="next btn"
                on:click={() => previewChange($previewItem.id, "NEXT")}
            >
                {@html nextIcon}
            </button>
            <button
                class="expand btn"
                on:click={() => {
                    fullMode = !fullMode;
                }}
            >
                {@html expandIcon}
            </button>
        </div>
    </div>
{/if}

<style>
    .preview-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: top;
    }
    .preview-tools {
        position: absolute;
        top: 0;
        opacity: 0.2;
        background-color: var(--primary-bg-color);
        display: flex;
        align-items: center;
        flex-flow: column nowrap;
        gap: 0.5rem;
        padding: 1rem 0rem;
        cursor: pointer;
        border-radius: 0.5rem;
        transition: opacity 0.2s linear;
    }
    .preview-tools:hover {
        opacity: 1;
    }
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .preview-full {
        /* height: 100%; */
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 3;
    }
    .preview-half {
        position: sticky;
        top: 0;
        align-self: start;
        border-left: 1px solid var(--primary-color);
    }
    @media (max-width: 600px) {
        .preview-tools {
            opacity: unset;
            /* border-radius: 50%; */
            padding: 0.5rem;
            background: none;
        }
        .preview-tools button:not(:first-child) {
            display: none;
        }
    }
</style>
