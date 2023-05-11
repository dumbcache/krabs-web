<script>
    import logout from "$lib/assets/logout.svg?raw";
</script>

<header class="header">
    <a href="/"><h1 class="title">K</h1></a>
    <button class="button__signin btn" />
    <button class="button__signout btn">
        {@html logout}
    </button>
</header>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--color-white-level-four);
        padding: 1rem 1rem;
    }
    .button__signin {
        display: none;
    }
</style>
