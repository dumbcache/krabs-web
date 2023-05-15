import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { loadMainContent } from "$lib/scripts/drive";
import { get } from "svelte/store";
import { isLoggedin } from "$lib/scripts/utils";

export const load = (({ params, fetch }) => {
    if (browser) {
        // if (!get(isLoggedin)) throw redirect(302, "/");
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
