import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { loadMainContent } from "$lib/scripts/drive";
import { activeParentId, activeParentName, online } from "$lib/scripts/stores";
import { get } from "svelte/store";

export const load = (({ params, fetch }) => {
    if (browser) {
        // online.set(window.navigator.onLine);
        // if (!get(online)) return;
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        if (params.id === "r") activeParentName.set("root");
        activeParentId.set(parent!);
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
