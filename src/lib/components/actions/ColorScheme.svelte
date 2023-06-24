<script lang="ts">
    import lightModeIcon from "$lib/assets/lightMode.svg?raw";
    import darkModeIcon from "$lib/assets/darkMode.svg?raw";
    import { onMount } from "svelte";
    import { toggleColorMode } from "$lib/scripts/utils";

    onMount(() => {
        let active = window.localStorage.getItem("krabColorScheme");
        const root = document.documentElement;
        const schemeEle = document.querySelector(
            ".color-scheme"
        ) as HTMLButtonElement;
        const lightEle = schemeEle.querySelector(
            ".light-icon"
        ) as HTMLSpanElement;
        const darkEle = schemeEle.querySelector(
            ".dark-icon"
        ) as HTMLSpanElement;
        active = active ?? "auto";
        switch (active) {
            case "light":
                root.classList.remove("dark");
                darkEle.style.visibility = "hidden";
                lightEle.style.visibility = "initial";
                schemeEle.ariaChecked = "true";
                return;
            case "dark":
                root.classList.add("dark");
                lightEle.style.visibility = "hidden";
                darkEle.style.visibility = "initial";
                schemeEle.ariaChecked = "true";
                return;
            case "auto":
                const current = window.matchMedia("(prefers-color-scheme: dark")
                    .matches
                    ? "dark"
                    : "light";
                if (current === "dark") {
                    root.classList.add("dark");
                    lightEle.style.visibility = "hidden";
                    darkEle.style.visibility = "initial";
                    schemeEle.ariaChecked = "false";
                    return;
                } else {
                    root.classList.remove("dark");
                    darkEle.style.visibility = "hidden";
                    lightEle.style.visibility = "initial";
                    schemeEle.ariaChecked = "false";
                    return;
                }
        }
    });
</script>

<button
    type="button"
    class="color-scheme"
    aria-label="Dark mode"
    role="switch"
    aria-checked="false"
    title="toggle dark mode"
    on:click={toggleColorMode}
>
    <span class="light-icon icon">
        {@html lightModeIcon}
    </span>
    <span class="dark-icon icon">
        {@html darkModeIcon}
    </span>
</button>

<style>
    .color-scheme {
        display: flex;
        align-items: center;
        border-radius: 1.5rem;
        width: calc(2 * var(--primary-icon-size));
        height: var(--primary-icon-size);
        justify-content: space-between;
        border: 1px solid var(--theme-button-outline);
        overflow: hidden;
    }
    .color-scheme:hover {
        filter: none;
        border: 1px solid var(--theme-button-hover-outline);
    }
    .color-scheme:hover .icon {
        background-color: var(--theme-button-hover-background);
    }
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--secondary-icon-size);
        height: var(--secondary-icon-size);
        border-radius: 50%;
        background-color: var(--theme-button-background);
    }
    span :global(svg) {
        fill: var(--theme-button-svg-fill);
    }

    .dark-icon {
        visibility: hidden;
    }
</style>
