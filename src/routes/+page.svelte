<script>
    // import { page } from "$app/stores";
    import ColorScheme from "$lib/components/ColorScheme.svelte";
    import LoginButton from "$lib/components/LoginButton.svelte";
    import LogoutButton from "$lib/components/LogoutButton.svelte";
</script>

<header class="header">
    <!-- <ColorScheme /> -->
    <LoginButton />
</header>
<h1 class="home-title">Krabs</h1>

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
        font-size: 15rem;
    }

    @media (max-width: 600px) {
        .home-title {
            font-size: 5rem;
        }
    }
</style>
