<script>
    import { goto } from "$app/navigation";
    import ColorScheme from "$lib/components/actions/ColorScheme.svelte";
    import LogoutButton from "$lib/components/actions/LogoutButton.svelte";
    import { previewItem } from "$lib/scripts/stores";
    import Nav from "./Nav.svelte";
</script>

<header class="header">
    <button
        on:click={() => {
            $previewItem = undefined;
            goto("r", { noScroll: true });
        }}><h1 class="title">PD</h1></button
    >
    <div class="nav">
        <Nav />
    </div>
    <div class="wrapper">
        <ColorScheme />
        <LogoutButton />
    </div>
</header>

<style>
    button {
        cursor: pointer;
    }
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
        z-index: 2;
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
