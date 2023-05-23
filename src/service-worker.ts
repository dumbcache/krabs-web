/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";
// import {} from "./lib/scripts/dr"
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_APP = `krabs_app-${version}`;
const CACHE_DATA = `krabs_data-${version}`;
const ASSETS = [
    ...build, // the app itself
    ...files, // everything in `static`
];

let idbRequest: IDBOpenDBRequest;
function initIDB() {
    idbRequest = indexedDB.open("krabfiles", 1);
    idbRequest.onsuccess = () => {
        const db = idbRequest.result;
        console.log(db);
        db.onversionchange = () => {
            postMessage({ context: "IDB_RELOAD_REQUIRED" });
        };
        db.onclose = (e) => {
            console.log(`db closed`, e);
        };
        db.onerror = (e) => {
            console.log(`db errored out`, e);
        };
    };
    idbRequest.onupgradeneeded = () => {
        const db = idbRequest.result;
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id" });
        }
    };
    idbRequest.onerror = () => {
        console.log(idbRequest.error);
    };
    idbRequest.onblocked = (e) => {
        console.log(`dbclosed`, e);
        postMessage({ context: "IDB_RELOAD_REQUIRED" });
    };
}

export const DIR_MIME_TYPE = "application/vnd.google-apps.folder";
export const IMG_MIME_TYPE = "image/";
export const FILE_API = "https://www.googleapis.com/drive/v3/files";
export const FIELDS_REQUIRED =
    "files(id,name,appProperties(origin),thumbnailLink)";

function checkForImgLocal(id: string, token: string, broadcast: WindowClient) {
    const db = idbRequest.result;
    const objectStore = db.transaction("images").objectStore("images");
    const req = objectStore.get(id);
    req.onsuccess = async (e) => {
        const result = (e.target as IDBRequest).result;
        if (!result) {
            downloadImage(id, token)
                .then((blob) => {
                    const objectStore = db
                        .transaction("images", "readwrite")
                        .objectStore("images");
                    objectStore.put({ id, blob });
                    broadcast.postMessage({ context: "IMG_PREVIEW", id, blob });
                })
                .catch((e) => {
                    broadcast.postMessage({
                        context: "IMG_PREVIEW_FAILED",
                        status: e.status,
                    });
                    console.warn(e);
                });
            return;
        }
        broadcast.postMessage({
            context: "IMG_PREVIEW",
            id,
            blob: result.blob,
        });
    };
}

function downloadImage(id: string, token: string): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
        let res = await fetch(`${FILE_API}/${id}?alt=media`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status !== 200) {
            if (res.status === 401) reject({ status: 401 });
            reject({ status: res.status });
        }
        const data = await res.blob();
        resolve(data);
    });
}

/***************** Broadcast Channel ****************/

sw.addEventListener("message", (event) => {
    if (event.data && event.data.context === "IMG_PREVIEW") {
        sw.clients
            .matchAll({
                includeUncontrolled: true,
                type: "window",
            })
            .then((clients) => {
                if (clients && clients.length) {
                    const { id, token } = event.data;
                    checkForImgLocal(id, token, clients[0]);
                }
            });
    }
});

/***************** SW Event Listners****************/
sw.addEventListener("install", (e) => {
    async function addFilesToCache() {
        initIDB();
        const cache = await caches.open(CACHE_APP);
        await cache.addAll(ASSETS);
    }
    e.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", (e) => {
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE_APP) await caches.delete(key);
        }
    }

    e.waitUntil(deleteOldCaches());
});

sw.addEventListener("fetch", (e) => {
    // if (e.request.method !== "GET") return;
    // async function respond() {
    //     const url = new URL(e.request.url);
    //     const cache = await caches.open(CACHE_APP);
    //     console.log(url.pathname);
    //     if (url.host.startsWith("www.googleapis.com")) {
    //     }
    //     // // `build`/`files` can always be served from the cache
    //     if (ASSETS.includes(url.pathname)) {
    //         return cache.match(url.pathname);
    //     }
    //     // // for everything else, try the network first, but
    //     // // fall back to the cache if we're offline
    //     try {
    //         const response = await fetch(e.request);
    //         if (response.status === 200) {
    //             // cache.put(e.request, response.clone());
    //         }
    //         return response;
    //     } catch {
    //         return cache.match(e.request);
    //     }
    // }
    // e.respondWith(respond());
});
