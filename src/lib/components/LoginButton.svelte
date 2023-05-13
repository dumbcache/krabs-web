<script lang="ts">
    import { loadGSIScript, isLoggedin } from "$lib/scripts/utils";
    import { onMount } from "svelte";

    // console.log($isLoggedin);
    onMount(() => {
        try {
            loadGSIScript();
        } catch (error) {
            console.warn(error);
        }
    });
</script>

<button class="button__signin btn" />

<style>
    .button__signin {
        width: fit-content;
        height: fit-content;
        filter: none;
        overflow: hidden;
        border-radius: 50%;
    }
</style>
