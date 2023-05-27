import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { checkLoginStatus } from "$lib/scripts/utils";
import { isLoggedin } from "$lib/scripts/stores";
import { browser } from "$app/environment";

export const load = () => {
    if (browser) {
        isLoggedin.set(checkLoginStatus() ?? false);
        if (get(isLoggedin)) {
            throw redirect(302, "/r");
        }
    }
};
