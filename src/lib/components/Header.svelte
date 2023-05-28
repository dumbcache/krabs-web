<script>
    import ColorScheme from "$lib/components/actions/ColorScheme.svelte";
    import LogoutButton from "$lib/components/actions/LogoutButton.svelte";
    import Nav from "./Nav.svelte";
</script>

<header class="header">
    <a href="/r"><h1 class="title">K</h1></a>
    <div class="nav">
        <Nav />
    </div>
    <div class="wrapper">
        <ColorScheme />
        <LogoutButton />
    </div>
</header>

<style>
    .header {
        position: sticky;
        top: 0;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        border-right: 1px solid var(--header-border-color);
        width: fit-content;
        height: 100vh;
        padding: 1rem 0.5rem;
        z-index: 1;
    }
    .wrapper {
        display: flex;
        flex-flow: column;
        align-items: center;
        gap: 2rem;
    }
    .title {
        font-size: var(--title-size);
    }
    @media (max-width: 600px) {
        .header {
            position: relative;
            height: initial;
            width: initial;
            flex-flow: row nowrap;
            padding: 0.5rem;
            border-right: none;
            border-bottom: 1px solid var(--header-border-color);
            /* display: none; */
        }
        .wrapper {
            flex-flow: row nowrap;
            justify-content: end;
        }
        .nav {
            display: none;
        }
    }
</style>
