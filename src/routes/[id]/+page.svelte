<script lang="ts">
    import Dirs from "$lib/components/Dirs.svelte";
    import Imgs from "$lib/components/Imgs.svelte";
    import type { PageData } from "./$types";
    import DirCreate from "$lib/components/DirCreate.svelte";

    export let data: PageData;

    let type: "update" | "delete";
    let dirToggle = false;
    let activeId = "";
    let activeName = "";
</script>

{#if data.dirs?.files.length !== 0 || data.imgs?.files.length !== 0}
    {#if data.dirs?.files}
        <Dirs
            dirs={data.dirs?.files}
            on:editDir={(e) => {
                activeId = e.detail.id;
                activeName = e.detail.name;
                dirToggle = true;
                type = "update";
            }}
            on:deleteDir={(e) => {
                activeId = e.detail.id;
                dirToggle = true;
                type = "delete";
            }}
        />
    {/if}
    {#if data.imgs?.files}
        <Imgs imgs={data.imgs.files} />
    {/if}
{:else}
    <p>No Files</p>
{/if}
{#if dirToggle}
    <DirCreate
        {type}
        id={activeId}
        name={type !== "delete" ? activeName : ""}
        on:dirUpdateClose={() => (dirToggle = false)}
        on:dirDeleteClose={() => (dirToggle = false)}
    />
{/if}

<style>
    p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
