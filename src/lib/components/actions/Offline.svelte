<script lang="ts">
    import krabsIcon from "$lib/assets/krabs.svg?raw";
</script>

<div class="offline">
    <div class="logo">
        {@html krabsIcon}
    </div>
    <p>You're offline</p>
</div>

<style>
    .offline {
        height: 100vh;
        width: 100vw;
        display: grid;
        place-content: center;
    }
    .logo :global(svg) {
        fill: var(--primary-color);
    }
</style>
