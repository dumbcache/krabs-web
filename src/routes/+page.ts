import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";
import { checkLoginStatus } from "$lib/scripts/utils";
import { isLoggedin } from "$lib/scripts/stores";
import { browser } from "$app/environment";

export const load = () => {
    if (browser) {
        if (!checkLoginStatus()) {
            isLoggedin.set(false);
            return;
        }
        isLoggedin.set(true);
        throw redirect(302, "/r");
    }
};
