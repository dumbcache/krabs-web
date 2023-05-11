<script>
    import { page } from "$app/stores";
    import logout from "$lib/assets/logout.svg?raw";

    console.log($page);
</script>

<header class="header">
    <button class="button__signin btn" />
    <button class="button__signout btn">
        {@html logout}
    </button>
</header>
<h1 class="home-title">Krabs</h1>

<style>
    .header {
        width: fit-content;
        margin-left: auto;
        padding: 2rem;
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
