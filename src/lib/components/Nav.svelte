<script lang="ts">
    import { page } from "$app/stores";
    import Tools from "$lib/components/actions/Tools.svelte";
    import beforeNavigate from "$lib/assets/beforeNavigate.svg?raw";
    import { previewItem } from "$lib/scripts/stores";

    let id: string;
    $: id = $page.params.id ?? "";
    let backButton: HTMLButtonElement;
    $: backButton &&
        (backButton.style.visibility = id === "r" ? "hidden" : "initial");
</script>

<nav class="navigation">
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
    <Tools />
</nav>

<style>
    .navigation {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        background: inherit;
        z-index: 1;
        padding: 1rem 1rem 1rem 0rem;
    }
    .back-button {
        display: flex;
        width: fit-content;
        align-items: center;
        font-size: 1.4rem;
    }
    .back-button :global(svg) {
        width: var(--secondary-icon-size);
        height: var(--secondary-icon-size);
    }
</style>
