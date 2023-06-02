<script lang="ts">
    import editIcon from "$lib/assets/edit.svg?raw";
    import { editMode } from "$lib/scripts/stores";
</script>

<button class="edit-button btn" on:click={() => ($editMode = "delete")}>
    {@html editIcon}
</button>
