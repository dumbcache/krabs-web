<script>
    import { page } from "$app/stores";
    import logoutIcon from "$lib/assets/logout.svg?raw";
    import ColorScheme from "$lib/components/ColorScheme.svelte";

    console.log($page);
</script>

<header class="header">
    <ColorScheme />
    <button class="button__signin btn" />
    <button class="button__signout btn">
        {@html logoutIcon}
    </button>
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

    .button__signout {
        display: none;
    }
</style>
