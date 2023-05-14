<script>
    import { dropItems } from "$lib/scripts/utils";
    import DropItem from "./DropItem.svelte";

    $: console.log($dropItems);
</script>

{#if $dropItems.length !== 0}
    <div class="drop">
        {#each $dropItems as item}
            <DropItem {item} />
        {/each}
    </div>
{/if}
