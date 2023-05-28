<script lang="ts">
    import { page } from "$app/stores";
    import beforeNavigate from "$lib/assets/beforeNavigate.svg?raw";
    import { previewItem } from "$lib/scripts/stores";

    let id: string;
    $: id = $page.params.id ?? "";
    let backButton: HTMLButtonElement;
    $: backButton &&
        (backButton.style.visibility = id === "r" ? "hidden" : "initial");
</script>

<button
    class="back-button btn"
    bind:this={backButton}
    on:click={() => {
        history.back();
        $previewItem = undefined;
    }}
>
    {@html beforeNavigate} back
</button>

<style>
    .back-button {
        display: flex;
        width: fit-content;
        align-items: center;
        font-size: 1.4rem;
        cursor: pointer;
        color: #f0f;
    }
    .back-button :global(svg) {
        width: var(--secondary-icon-size);
        height: var(--secondary-icon-size);
    }
</style>
