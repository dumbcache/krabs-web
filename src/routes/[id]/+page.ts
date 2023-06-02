import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { loadMainContent } from "$lib/scripts/drive";
import { activeParentId, activeParentName } from "$lib/scripts/stores";

export const load = (({ params, fetch }) => {
    if (browser) {
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        if (params.id === "r") activeParentName.set("root");
        activeParentId.set(parent!);
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
