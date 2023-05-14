import { error, redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import {
    DIR_MIME_TYPE,
    IMG_MIME_TYPE,
    getFiles,
    loadMainContent,
} from "$lib/scripts/drive";
import { get } from "svelte/store";
import { getToken, isLoggedin } from "$lib/scripts/utils";

export const load = (({ params, fetch }) => {
    if (browser) {
        if (!get(isLoggedin)) throw redirect(302, "/");
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        return loadMainContent(parent!);
    }
}) satisfies PageLoad;
