<script lang="ts">
    import imgCreate from "$lib/assets/imgCreate.svg?raw";
    import folderCreate from "$lib/assets/folderCreate.svg?raw";
    import refresh from "$lib/assets/refresh.svg?raw";
    import { imgPickerHandler } from "$lib/scripts/utils";
</script>

<div class="tools">
    <button class="refresh-button btn">
        {@html refresh}
    </button>
    <label for="img-picker" class="button__create-img btn">
        {@html imgCreate}
    </label>
    <input
        type="file"
        name="img-picker"
        id="img-picker"
        accept="image/*"
        multiple
        on:change={imgPickerHandler}
    />
    <button class="button__create-folder btn">
        {@html folderCreate}
    </button>
</div>

<style>
    .tools {
        display: flex;
        gap: 1rem;
    }
    #img-picker {
        display: none;
    }
</style>
