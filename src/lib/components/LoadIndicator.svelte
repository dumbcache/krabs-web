<script>
    import progressIcon from "$lib/assets/progress.svg?raw";
</script>

<div class="load-indicator">
    {@html progressIcon}
</div>

<style>
    @keyframes spin {
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    .load-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 5rem;
        -webkit-animation: spin 1.5s linear 0s infinite;
        animation: spin 1.5s linear 0s infinite;
    }
    .load-indicator :global(svg) {
        fill: var(--primary-svg-fill);
    }
</style>
