<script>
    import ColorScheme from "$lib/components/actions/ColorScheme.svelte";
    import { navigating } from "$app/stores";
    import LoadIndicator from "$lib/components/actions/LoadIndicator.svelte";
    import { getOauthToken } from "$lib/scripts/utils";
    import googleIcon from "$lib/assets/google.png";
</script>

{#if $navigating}
    <LoadIndicator />
{:else}
    <header class="header">
        <ColorScheme />
        <button on:click={getOauthToken} class="signin"
            ><img src={googleIcon} alt="signin" /></button
        >
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
        gap: 3rem;
    }
    .signin {
        width: var(--size-large);
        background-color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        cursor: pointer;
        filter: none;
        border: 1px solid #1115;
    }
    .signin:hover {
        background-color: #fffc;
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
        .header {
            gap: 2rem;
        }
        /* .signin {
            width: var(--size-large);
        } */
        .home-title {
            font-size: 5rem;
        }
    }
</style>
