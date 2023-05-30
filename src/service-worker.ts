/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";
// import {} from "./lib/scripts/dr"
const sw = self as unknown as ServiceWorkerGlobalScope;

const DIR_MIME_TYPE = "application/vnd.google-apps.folder";
const IMG_MIME_TYPE = "image/";
const FILE_API = "https://www.googleapis.com/drive/v3/files";
const FIELDS_REQUIRED = "files(id,name,appProperties(origin),thumbnailLink)";

const CACHE_APP = `krabs_app-${version}`;
const CACHE_DATA = `krabs_data-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files, // everything in `static`
];

/***************** SW Event Listners****************/
sw.addEventListener("install", (e) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE_APP);
        await cache.addAll(ASSETS);
    }
    e.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", (e) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE_APP && key !== CACHE_DATA)
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
                    const cache = await caches.open(CACHE_APP);
                    if (ASSETS.includes(url.pathname)) {
                        return cache.match(url.pathname) as Promise<Response>;
                    } else {
                        return fetch(e.request) as Promise<Response>;
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
