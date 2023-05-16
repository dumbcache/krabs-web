import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { loadMainContent } from "$lib/scripts/drive";
import { activeParent } from "$lib/scripts/utils";

export const load = (({ params, fetch }) => {
    if (browser) {
        // if (!get(isLoggedin)) throw redirect(302, "/");
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        activeParent.set(parent!);
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
