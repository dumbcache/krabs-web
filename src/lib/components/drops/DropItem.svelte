<script lang="ts">
    import closeIcon from "$lib/assets/close.svg?raw";
    import loadingIcon from "$lib/assets/progress.svg?raw";
    import successIcon from "$lib/assets/success.svg?raw";
    import failureIcon from "$lib/assets/failure.svg?raw";
    import { removeDropEntry } from "$lib/scripts/utils";
    export let item: DropItem;
    let progressIcon: string;
    $: item.progress === "uploading"
        ? (progressIcon = loadingIcon)
        : item.progress === "success"
        ? (progressIcon = successIcon)
        : (progressIcon = failureIcon);
</script>

<div class="drop-item" data-id={item.id}>
    <img src={item.imgRef} class="drop-img" alt="" />
    {#if item.progress !== "uploading" && item.progress !== "success"}
        <button class="remove btn" on:click={() => removeDropEntry(item.id)}>
            {@html closeIcon}
        </button>
        <input
            type="text"
            class="parent"
            disabled
            on:keydown|stopPropagation
            value={item.parentName}
            on:click={(e) => e.target.select()}
        />
        <input
            type="text"
            class="name"
            placeholder="name"
            value={item.name || ""}
            on:keydown|stopPropagation
            on:click={(e) => e.target.select()}
        />
        <input
            type="text"
            class="url"
            placeholder="url"
            value={item.url || ""}
            on:keydown|stopPropagation
            on:click={(e) => e.target.select()}
        />
    {/if}
    {#if item.progress}
        <div class="progress">
            <div
                class="progress-icon {item.progress === 'uploading'
                    ? 'anime uploading'
                    : ''}"
            >
                {@html progressIcon}
            </div>
        </div>
    {/if}
</div>

<style>
    .drop-item {
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        border-radius: 1rem;
        max-width: 20rem;
        border-bottom: none;
        /* background-color: #ddd; */
        border: 1px solid var(--cover-border-color);
        border-bottom: none;
        overflow: hidden;
    }
    .drop-img {
        height: 15rem;
        max-width: 100%;
        object-fit: cover;
        object-position: top;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
    }
    .drop-item:hover .drop-img {
        filter: brightness(0.5);
    }
    .remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        filter: none;
        width: var(--size-small);
        height: var(--size-small);
    }
    .remove :global(svg) {
        fill: var(--color-white);
    }
    .progress {
        border-radius: 1rem;
        display: grid;
        place-content: center;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: var(--primary-backdrop-color);
    }
    .progress :global(svg) {
        width: var(--primary-icon-size);
        height: var(--primary-icon-size);
    }
    .progress-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .progress .uploading {
        fill: var(--color-white);
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .anime {
        -webkit-animation: spin 1.5s linear 0s infinite;
        animation: spin 1s linear 0s infinite;
    }
    @media (max-width: 600px) {
        .drop-item {
            max-width: 45%;
        }
        .drop-img {
            height: 15rem;
        }
    }
</style>
