<script lang="ts">
    export let item: { src: string; name: string; url: string };
</script>

<div class="drop-item">
    <img src={item.src} alt="" />
    <input type="text" placeholder="name" value={item.name} />
    <input type="text" placeholder="url" value={item.url} />
</div>
