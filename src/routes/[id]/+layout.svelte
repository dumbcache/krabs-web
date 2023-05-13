<script>
    import Nav from "$lib/components/Nav.svelte";
    import Header from "$lib/components/Header.svelte";
</script>

<svelte:head>
    <title>Karbs:root</title>
</svelte:head>

<Header />
<Nav />
<main class="main">
    <slot />
</main>
