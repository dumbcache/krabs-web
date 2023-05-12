<script lang="ts">
    import { page } from "$app/stores";
    import Tools from "./Tools.svelte";
    import beforeNavigate from "$lib/assets/beforeNavigate.svg?raw";
    import { onMount } from "svelte";

    const { id } = $page.params;
    let backButton: HTMLButtonElement;
    onMount(() => {
        backButton.style.visibility = id === "d" ? "hidden" : "initial";
    });
</script>

<nav class="navigation">
    <!-- {#if id !== "d"} -->
    <button class="back-button btn" bind:this={backButton}>
        {@html beforeNavigate} back
    </button>
    <!-- {/if} -->
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
    }
    .back-button :global(svg) {
        width: 3rem;
    }
</style>
