<script>
    import ColorScheme from "$lib/components/actions/ColorScheme.svelte";
    import LoginButton from "$lib/components/actions/LoginButton.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/actions/LoadIndicator.svelte";
</script>

{#if $navigating}
    <LoadIndicator />
{:else}
    <header class="header">
        <ColorScheme />
        <LoginButton />
    </header>
    <h1 class="home-title">Pocket Drive</h1>
{/if}

<style>
    .header {
        width: fit-content;
        margin-left: auto;
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    .home-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 900;
        font-size: 10rem;
    }

    @media (max-width: 600px) {
        .home-title {
            font-size: 5rem;
        }
    }
</style>
