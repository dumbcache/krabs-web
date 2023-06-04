<script lang="ts">
    import editIcon from "$lib/assets/edit.svg?raw";
    import { mode } from "$lib/scripts/stores";
</script>

<button
    class="edit-button btn"
    title="edit mode"
    on:click={() => ($mode = "delete")}
>
    {@html editIcon}
</button>
