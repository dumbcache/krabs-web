<script>
    import logout from "$lib/assets/logout.svg?raw";
    import ColorScheme from "$lib/components/ColorScheme.svelte";
</script>

<header class="header">
    <a href="/"><h1 class="title">K</h1></a>
    <div class="wrapper">
        <ColorScheme />
        <button class="button__signin btn" />
        <button class="button__signout btn">
            {@html logout}
        </button>
    </div>
</header>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--header-border-color);
        padding: 1rem 1rem;
    }
    .wrapper {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    .button__signin {
        display: none;
    }
</style>
