import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { loadMainContent } from "$lib/scripts/drive";
import { activeParent, activeParentName } from "$lib/scripts/utils";
import { get } from "svelte/store";

export const load = (({ params, fetch }) => {
    if (browser) {
        // if (!get(isLoggedin)) throw redirect(302, "/");
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        if (params.id === "r") activeParentName.set("root");
        activeParent.set(parent!);
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
