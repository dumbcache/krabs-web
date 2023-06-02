/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_STATIC = `app-${version}`;
const CACHE_APP = `krabs_app-${version}`;
const CACHE_DATA = `krabs_data-${version}`;

/***************** SW Event Listners****************/
sw.addEventListener("install", (e) => {
    async function addFilesToCache() {
        const cache1 = await caches.open(CACHE_STATIC);
        await cache1.addAll(files);
        const cache2 = await caches.open(CACHE_APP);
        await cache2.addAll(build);
    }
    e.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", (e) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE_APP && key !== CACHE_DATA && key != CACHE_STATIC)
                await caches.delete(key);
        }
    }

    e.waitUntil(deleteOldCaches());
});

sw.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET") return;
    if (e.request.mode === "navigate") return;
    const url = new URL(e.request.url);
    switch (url.host) {
        case self.location.host:
            e.respondWith(
                (async () => {
                    if (files.includes(url.pathname)) {
                        const cache = await caches.open(CACHE_STATIC);
                        return cache.match(url.pathname) as Promise<Response>;
                    } else if (build.includes(url.pathname)) {
                        const cache = await caches.open(CACHE_APP);
                        return cache.match(url.pathname) as Promise<Response>;
                    } else {
                        const cache = await caches.open(CACHE_APP);
                        const response = await fetch(e.request);
                        if (response.status === 200) {
                            cache.put(e.request, response.clone());
                        }
                        return response;
                    }
                })()
            );
            break;

        case "www.googleapis.com":
            if (url.search === "?alt=media") return;
            e.respondWith(
                (async () => {
                    const cache = await caches.open(CACHE_DATA);
                    const cacheData = await cache.match(e.request);
                    if (cacheData) {
                        return cacheData;
                    } else {
                        const response = await fetch(e.request);
                        if (response.status === 200) {
                            cache.put(e.request, response.clone());
                        }
                        return response;
                    }
                })()
            );
            break;
        default:
            // e.respondWith(fetch(e.request));
            return;
    }
});
