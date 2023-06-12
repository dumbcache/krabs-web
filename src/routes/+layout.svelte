<script>
    import { onMount } from "svelte";
    import "./app.css";
    import { sessionTimeout } from "$lib/scripts/stores";
    import { checkSessionTimeout } from "$lib/scripts/utils";
    // import { navigating } from "$app/stores";
    // import LoadIndicator from "$lib/components/actions/LoadIndicator.svelte";

    onMount(() => {
        checkSessionTimeout();
    });
</script>

<!-- {#if $navigating}
    <LoadIndicator />
{:else}{/if} -->
<slot />
