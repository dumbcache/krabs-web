import { error, redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";
import type { PageLoad } from "./$types";
import { DIR_MIME_TYPE, IMG_MIME_TYPE, getFiles } from "$lib/scripts/drive";
import { get } from "svelte/store";
import { isLoggedin } from "$lib/scripts/utils";

export const load = (({ params, fetch }) => {
    if (browser) {
        if (!get(isLoggedin)) throw redirect(302, "/");
        const token = window.localStorage.getItem("token") as string;
        const parent =
            params.id === "r" ? window.localStorage.getItem("root") : params.id;
        return new Promise((resolve, reject) => {
            const promises = [
                getFiles(parent!, token, DIR_MIME_TYPE),
                getFiles(parent!, token, IMG_MIME_TYPE),
            ];
            Promise.all(promises)
                .then(([dirs, imgs]) => {
                    resolve({ dirs, imgs });
                })
                .catch((e) => {
                    console.warn(e);
                });
        });
    }
}) satisfies PageLoad;
