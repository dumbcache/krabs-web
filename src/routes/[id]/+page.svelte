<script lang="ts">
    import Dirs from "$lib/components/Dirs.svelte";
    import Imgs from "$lib/components/Imgs.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    $: console.log(data);
</script>

<Dirs dirs={data.dirs.files} />
<Imgs imgs={data.imgs.files} />

<style>
</style>
