<script>
    import progressIcon from "$lib/assets/progress.svg?raw";
</script>

<div class="load-indicator">
    {@html progressIcon}
</div>

<style>
    @keyframes spin {
        0% {
            transform: translate(-50%, -50%) rotate(0deg);
        }
        50% {
            transform: translate(-50%, -50%) rotate(180deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg);
        }
    }
    .load-indicator {
        width: 5rem;
        -webkit-animation: spin 1.5s linear 0s infinite;
        animation: spin 1s linear 0s infinite;
    }
    .load-indicator :global(svg) {
        fill: var(--primary-svg-fill);
    }
</style>
