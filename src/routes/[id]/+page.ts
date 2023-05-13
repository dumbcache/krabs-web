import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { DIR_MIME_TYPE, IMG_MIME_TYPE, getFiles } from "$lib/scripts/drive";

export const load = (({ params }) => {
    const token = window.localStorage.getItem("token") as string;
    const parent =
        params.id === "r" ? window.localStorage.getItem("root") : params.id;
    return new Promise((resolve, reject) => {
        const promises = [
            getFiles(parent!, token, DIR_MIME_TYPE),
            getFiles(parent!, token, IMG_MIME_TYPE),
        ];
        Promise.all(promises).then(([dirs, imgs]) => {
            resolve({ dirs, imgs });
        });
    });
}) satisfies PageLoad;
