<script lang="ts">
    import expandIcon from "$lib/assets/expandDown.svg?raw";
    import editIcon from "$lib/assets/edit.svg?raw";
    import deleteIcon from "$lib/assets/delete.svg?raw";

    export let type: "dir" | "img";
    console.log(type);
</script>

<div class="edit-tools">
    <button class="btn expand" on:click|stopPropagation>
        {@html expandIcon}
    </button>
    <button class="btn action" on:click|stopPropagation>
        {@html editIcon}
    </button>
    <button class="btn action" on:click|stopPropagation>
        {@html deleteIcon}
    </button>
</div>

<style>
    .edit-tools {
        padding: 0.5rem;
        position: absolute;
        top: 1rem;
        right: 0.5rem;
        display: flex;
        flex-flow: column nowrap;
        gap: 0.5rem;
        height: 4rem;
        overflow: hidden;
    }
    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .btn :global(svg) {
        fill: var(--color-white-level-one);
        width: var(--secondary-icon-size);
    }
    .edit-tools:hover .expand {
        display: none;
    }
    .edit-tools:hover .action {
        visibility: initial;
        opacity: 1;
    }
    .edit-tools:hover {
        height: initial;
    }
    .action {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.5s linear;
    }
    @media (max-width: 600px) {
        .edit-tools {
            top: 0;
            right: 0;
            gap: 0;
        }
    }
</style>
