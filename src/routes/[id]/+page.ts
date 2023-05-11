import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
    return {
        param: params.id,
    };
}) satisfies PageLoad;
