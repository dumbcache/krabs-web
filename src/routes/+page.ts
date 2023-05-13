import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { isLoggedin } from "$lib/scripts/utils";

export const load = () => {
    if (get(isLoggedin)) {
        throw redirect(302, "/r");
    }
};
