<script lang="ts">
    import { goto } from "$app/navigation";
    import { previewItem } from "$lib/scripts/stores";
    import DirCover from "$lib/components/dirs/DirCover.svelte";
    import { updateRecents, previewAndSetDropItems } from "$lib/scripts/utils";

    export let dir: GoogleFile;
    let draggedOver = false;
    function dirNavigate(e) {
        $previewItem = undefined;
        goto(`/${dir.id}`);
        updateRecents({ name: dir.name, id: dir.id });
    }

    export function imgDropHandler(e: DragEvent) {
        e.preventDefault();
        draggedOver = false;
        previewItem.set(undefined);
        if (e.dataTransfer?.files) {
            previewAndSetDropItems(e.dataTransfer.files, dir.id, dir.name);
        }
    }
</script>

<div
    class="dir-card {draggedOver === true ? 'dragover' : ''}"
    on:dragstart|preventDefault
    on:dragover|preventDefault
    on:dragenter={() => (draggedOver = true)}
    on:dragleave={() => (draggedOver = false)}
    on:drop|stopPropagation={imgDropHandler}
    data-id={dir.id}
>
    <button on:click={dirNavigate}>
        <DirCover
            id={dir.id}
            name={dir.name}
            starred={dir.starred}
            on:editDir
            on:deleteDir
            on:favStatus={() => (dir.starred = !dir.starred)}
        />
    </button>
    <h2 class="dir-title">{dir.name}</h2>
</div>

<style>
    .dir-card {
        position: relative;
    }
    button {
        filter: none;
    }
    .dir-card {
        width: var(--dir-width);
    }
</style>
