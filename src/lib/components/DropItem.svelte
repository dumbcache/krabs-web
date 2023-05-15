<script lang="ts">
    export let item: DropItem;
</script>

<div class="drop-item" data-id={item.id}>
    <img src={item.imgRef} class="drop-img" alt="" />
    <input type="text" placeholder="name" value={item.name || ""} />
    <input type="text" placeholder="url" value={item.url || ""} />
</div>

<style>
    .drop-item {
        display: flex;
        flex-flow: column nowrap;
        position: relative;
        border-radius: 1rem;
        max-width: 20rem;
        /* background-color: #ddd; */
    }
    .drop-img {
        height: 25rem;
        max-width: 100%;
        object-fit: cover;
        object-position: top;
        border-radius: 1rem;
    }
    .drop-item-uploading {
        filter: brightness(0.5);
        user-select: none;
        display: block;
    }
</style>
