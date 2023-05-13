import { isLoggedin } from "$lib/scripts/utils";
import { redirect } from "@sveltejs/kit";

export const load = () => {
    if (isLoggedin()) {
        throw redirect(302, "/r");
    }
};
