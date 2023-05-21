<script>
    import ColorScheme from "$lib/components/ColorScheme.svelte";
    import LogoutButton from "./LogoutButton.svelte";
</script>

<header class="header">
    <a href="/r"><h1 class="title">K</h1></a>
    <div class="wrapper">
        <ColorScheme />
        <LogoutButton />
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
    .title {
        font-size: var(--title-size);
    }
</style>
