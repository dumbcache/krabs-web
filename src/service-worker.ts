/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version, prerendered } from "$service-worker";

const sw = self as unknown as ServiceWorkerGlobalScope;

console.log({ build, files, version, prerendered });
const CACHE = `krabs cache-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files, // everything in `static`
];

sw.addEventListener("install", (e) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    e.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", (e) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    e.waitUntil(deleteOldCaches());
});
sw.addEventListener("fetch", (e) => {
    console.log(e);
    if (e.request.method !== "GET") return;

    async function respond() {
        const url = new URL(e.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            return cache.match(url.pathname);
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await fetch(e.request);

            if (response.status === 200) {
                cache.put(e.request, response.clone());
            }

            return response;
        } catch {
            return cache.match(e.request);
        }
    }

    e.respondWith(respond());
});
