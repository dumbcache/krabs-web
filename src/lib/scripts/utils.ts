import { goto } from "$app/navigation";
import {
    PUBLIC_KRAB_CLIENT_ID,
    PUBLIC_KRAB_API,
    PUBLIC_KRAB_NONCE_WEB,
} from "$env/static/public";
import { get } from "svelte/store";
import { browser } from "$app/environment";
import ChildWorker from "$lib/scripts/worker.ts?worker";
import {
    activeParentId,
    activeParentName,
    touchCoords,
    isLoggedin,
    previewItem,
    dropItems,
    recents,
    dataCacheName,
    editItems,
    selectedCount,
    editMode,
    editConfirm,
} from "$lib/scripts/stores";
import { fetchFiles, refreshMainContent } from "./drive";

export let childWorker: Worker;
if (browser) {
    childWorker = new ChildWorker();
    childWorker.onerror = (e) => console.warn(e);
    childWorker.onmessage = ({ data }) => {
        switch (data.context) {
            case "IMG_PREVIEW":
                const { id, blob } = data;
                const previewImg = document.querySelector(
                    ".preview-img"
                ) as HTMLImageElement;
                const target = document.querySelector(
                    `[data-id='${id}']`
                ) as HTMLDivElement;
                if (previewImg.dataset.id !== id) return;
                const url = URL.createObjectURL(blob);
                previewImg.src = url;
                target.dataset.url = url;
                return;

            case "IMG_PREVIEW_FAILED":
                if (data.status === 401) {
                    getToken();
                    return;
                }
                return;

            case "DROP_SAVE":
                // dropResultHandler(data.id, 200);
                dropItems.set(
                    get(dropItems).map((item) => {
                        item.id === data.id && (item.progress = "success");
                        return item;
                    })
                );
                return;

            case "DROP_SAVE_FAILED":
                // dropResultHandler(data.id, data.status);
                dropItems.set(
                    get(dropItems).map((item) => {
                        item.id === data.id && (item.progress = "failure");
                        return item;
                    })
                );
                if (data.status === 401) {
                    getToken();
                    return;
                }
                return;

            case "IMG_DELETE":
                // console.log("deleted")
                fetchFiles(get(activeParentId), "imgs", 1000, true).then(() =>
                    // window.location.reload();
                    // console.log("refresh")
                    refreshMainContent(get(activeParentId), "imgs").then(() => {
                        editItems.set([]);
                        selectedCount.set(0);
                        editMode.set("");
                    })
                );
                return;
            case "IDB_RELOAD_REQUIRED":
                return;
        }
    };
}

export async function setCacheName() {
    for (let key of await caches.keys()) {
        if (key.startsWith("krabs_data")) dataCacheName.set(key);
    }
}

export const updateRecents = (data?: { name: string; id: string }) => {
    let old =
        (JSON.parse(window.localStorage.getItem("recents")!) as {
            name: string;
            id: string;
        }[]) ?? [];
    if (old.length === 0 && !data) return;
    if (data) {
        if (old?.length === 10) {
            old.pop();
        }
        old = old.filter((item) => item.id !== data.id);
        old.unshift(data);
    }
    recents.set(old);
    window.localStorage.setItem("recents", JSON.stringify(old));
};

export const toggleColorMode = () => {
    const root = document.documentElement;
    let active = window.localStorage.getItem("krabColorScheme");
    const schemeEle = document.querySelector(
        ".color-scheme"
    ) as HTMLButtonElement;
    const lightEle = schemeEle.querySelector(".light-icon") as HTMLSpanElement;
    const darkEle = schemeEle.querySelector(".dark-icon") as HTMLSpanElement;
    active = active ?? "auto";
    switch (active) {
        case "light":
            window.localStorage.setItem("krabColorScheme", "auto");
            root.classList.toggle("dark");
            lightEle.style.visibility = "hidden";
            darkEle.style.visibility = "initial";
            schemeEle.ariaChecked = "false";
            return;
        case "dark":
            window.localStorage.setItem("krabColorScheme", "auto");
            root.classList.toggle("dark");
            darkEle.style.visibility = "hidden";
            lightEle.style.visibility = "initial";
            schemeEle.ariaChecked = "false";
            return;
        case "auto":
            const current = window.matchMedia("(prefers-color-scheme: dark")
                .matches
                ? "dark"
                : "light";
            if (current === "dark") {
                window.localStorage.setItem("krabColorScheme", "light");
                root.classList.toggle("dark");
                darkEle.style.visibility = "hidden";
                lightEle.style.visibility = "initial";
                schemeEle.ariaChecked = "true";
                return;
            } else {
                window.localStorage.setItem("krabColorScheme", "dark");
                root.classList.toggle("dark");
                lightEle.style.visibility = "hidden";
                darkEle.style.visibility = "initial";
                schemeEle.ariaChecked = "true";
                return;
            }
    }
};

export const loadGSIScript = () => {
    const src = "https://accounts.google.com/gsi/client";
    const header = document.querySelector(".header") as HTMLDivElement;
    const gsiIfExists = header.querySelector(`script[src='${src}']`);
    if (gsiIfExists) header.removeChild(gsiIfExists);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
        window.google.accounts.id.initialize({
            client_id: PUBLIC_KRAB_CLIENT_ID,
            nonce: PUBLIC_KRAB_NONCE_WEB,
            auto_select: false,
            callback: handleGoogleSignIn,
        });
        window.google.accounts.id.prompt();
        window.google.accounts.id.renderButton(
            header.querySelector(".button__signin"),
            {
                type: "icon",
                shape: "circle",
                size: "medium",
            }
        );
    };
    script.onerror = (e) => console.log(e);
    header.append(script);
};

export const handleGoogleSignIn = async (googleRes: GoogleSignInPayload) => {
    const creds = googleRes?.credential;
    const res = await fetch(`${PUBLIC_KRAB_API}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ id_token: creds, app: "WEB" }),
    });
    if (res.status !== 200) {
        console.warn(res.status, await res.text());
        return;
    }
    const { token, root } = await res.json();
    localStorage.setItem("secret", token);
    localStorage.setItem("root", root);
    await getToken();
    isLoggedin.set(true);
    goto("/r");
};

export const getToken = async () => {
    const secret = window.localStorage.getItem("secret");
    const res = await fetch(`${PUBLIC_KRAB_API}/auth`, {
        headers: {
            Authorization: `Bearer ${secret}`,
        },
    });
    if (res.status !== 200) {
        if (res.status === 401) {
            console.log("session timeout");
            signUserOut();
            return;
        }
        console.warn(res.status, await res.text());
        return;
    }
    const { token } = await res.json();
    localStorage.setItem("token", token);
    return true;
};

export function checkLoginStatus() {
    if (browser) {
        const secret = window ? window.localStorage.getItem("secret") : false;
        return Boolean(secret);
    }
}

export async function signUserOut(e?: Event) {
    e?.stopPropagation();
    const secret = window.localStorage.getItem("secret");
    const res = await fetch(`${PUBLIC_KRAB_API}/logout/WEB`, {
        headers: {
            Authorization: `Bearer ${secret}`,
        },
    });
    await clearFiles();
    isLoggedin.set(false);
    console.log("logging user out");
    goto("/");
}
export async function clearFiles() {
    window.localStorage.clear();
    (await caches.keys()).forEach(
        (key) => key.startsWith("krabs") && caches.delete(key)
    );
}

export function handleTouchStart(e: TouchEvent) {
    if (e.touches.length >= 2) return;
    e.stopPropagation();
    if (e.changedTouches.length === 0) return;
    const { screenX, screenY } = e.changedTouches[0];
    touchCoords.set({ startX: screenX, startY: screenY });
}
export function handleTouchEnd(e: TouchEvent, targetId: string | undefined) {
    if (!targetId) return;
    if (e.touches.length >= 2) return;
    e.stopPropagation();
    if (e.changedTouches.length === 0) return;
    const { screenX, screenY } = e.changedTouches[0];
    touchCoords.set({ ...get(touchCoords), endX: screenX, endY: screenY });
    checkDirection(targetId);
}
export function handleTouchMove(e: TouchEvent) {
    if (e.touches.length >= 2) return;
    e.preventDefault();
    e.stopPropagation();
}
function checkDirection(targetId: string) {
    console.log(get(touchCoords));
    const { endX, endY, startX, startY } = get(touchCoords);
    if (endX && endY && startX && startY) {
        if (Math.abs(startX - endX) > 40) {
            //swipe left
            if (startX > endX) {
                previewChange(targetId, "NEXT");
                return;
            }
            //swipe right
            if (startX < endX) {
                previewChange(targetId, "PREV");
                return;
            }
        }
        if (Math.abs(startY - endY) > 40) {
            // swipe down
            if (startY < endY) {
                previewItem.set(undefined);
                return;
            }
            // swipe up
            if (startY > endY) {
                previewItem.set(undefined);
                return;
            }
        }
    }
}

export function fetchImgPreview(id: string) {
    const token = window.localStorage.getItem("token");

    childWorker.postMessage({
        context: "IMG_PREVIEW",
        id,
        token,
    });
}

export function previewChange(
    targetId: string | undefined,
    type: "PREV" | "NEXT"
) {
    if (!targetId) return;
    const imgs = document.querySelector(".imgs") as HTMLDivElement;
    const target = imgs.querySelector(`[data-id='${targetId}']`);
    const latestTarget = (
        type === "NEXT"
            ? target?.nextElementSibling
            : target?.previousElementSibling
    ) as HTMLDivElement;
    if (!latestTarget) return;

    const { id, url } = latestTarget.dataset as { id: string; url: string };
    const latestImg = latestTarget?.firstElementChild as HTMLImageElement;
    previewItem.set({ id, url, src: latestImg.src });
    if (url) return;

    fetchImgPreview(id);
}

export function previewShortcutHandler(
    e: KeyboardEvent,
    targetId: string | undefined
) {
    if (!targetId) return;
    if (e.altKey || e.metaKey || e.ctrlKey) {
        return;
    }
    const preview = document.querySelector(".preview") as HTMLDivElement;
    if (preview.hidden) return;
    e.preventDefault();
    e.stopPropagation();
    switch (e.key) {
        case "ArrowRight":
            previewChange(targetId, "NEXT");
            return;
        case "ArrowLeft":
            previewChange(targetId, "PREV");
            return;
        case "ArrowDown":
            previewItem.set(undefined);
            return;
        case "ArrowUp":
            const preview = document.querySelector(
                ".preview"
            ) as HTMLDivElement;
            preview.classList.toggle("preview-full");
            preview.classList.toggle("preview-half");
            return;
        case "Escape":
            previewItem.set(undefined);
            return;
    }
}

export function removeDropEntry(id: string) {
    dropItems.set(get(dropItems).filter((item) => item.id !== id));
}

export function clearDropItems() {
    const a = get(dropItems).filter((item) => item.progress !== "success");
    dropItems.set(a);
}

export function dropOkHandler() {
    const droppeditems = document.querySelector(
        ".drop-items"
    ) as HTMLDivElement;
    const commonUrl = (
        document.querySelector(".common-url") as HTMLInputElement
    ).value;
    const tempDirItems = [];
    console.log(get(dropItems));
    for (let item of get(dropItems)) {
        if (item.progress === "success") continue;
        const id = item.id;
        const dropItem = droppeditems.querySelector(
            `[data-id='${id}']`
        ) as HTMLDivElement;
        let dropImg = dropItem.querySelector(".drop-img") as HTMLImageElement;
        dropImg.classList.toggle("drop-item-uploading");
        // let dropProgress = dropItem.querySelector(
        //     ".drop-progress"
        // ) as HTMLImageElement;
        // dropProgress.hidden = false;
        let name = dropItem.querySelector(".name") as HTMLInputElement;
        item.name = name.value.trim();
        let url = dropItem.querySelector(".url") as HTMLInputElement;
        if (commonUrl.trim() === "") {
            item.url = url.value.trim();
        } else {
            item.url = commonUrl.trim();
        }
        item.progress = "uploading";
        tempDirItems.push(item);
    }
    dropItems.set(tempDirItems);
    const { pathname } = window.location;
    const parent =
        pathname === "/"
            ? window.localStorage.getItem("root")!
            : pathname.substring(1);
    const token = window.localStorage.getItem("token");
    childWorker.postMessage({
        context: "DROP_SAVE",
        dropItems: get(dropItems),
        parent,
        token,
    });
}

export function previewAndSetDropItems(files: FileList) {
    previewItem.set(undefined);
    for (let img of files!) {
        if (img.type.match("image/")) {
            // previewLoadDropItem(img, dropArea);
            // dropZone.hidden = false;
            const id = Date.now().toString();
            const imgRef = URL.createObjectURL(img);
            if (
                img.type === "image/gif" ||
                img.type === "image/avif" ||
                img.type === "image/webp"
            ) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result! as ArrayBuffer;
                    const bytes = new Uint8Array(result);
                    dropItems.set([
                        ...get(dropItems),
                        {
                            id,
                            name: id,
                            mimeType: img.type,
                            bytes,
                            imgRef,
                            parent: get(activeParentId),
                            parentName: get(activeParentName),
                        },
                    ]);
                };
                reader.readAsArrayBuffer(img);
            } else {
                const image = new Image();
                const c = document.createElement("canvas");
                const ctx = c.getContext("2d");

                image.onload = function () {
                    c.width = this.naturalWidth; // update canvas size to match image
                    c.height = this.naturalHeight;
                    ctx.drawImage(this, 0, 0);
                    c.toBlob(async function (blob) {
                        const result =
                            (await blob?.arrayBuffer()) as ArrayBuffer;
                        const bytes = new Uint8Array(result);
                        const imgRef = URL.createObjectURL(blob);
                        dropItems.set([
                            ...get(dropItems),
                            {
                                id,
                                name: id,
                                mimeType: blob?.type!,
                                bytes,
                                imgRef,
                                parent: get(activeParentId),
                                parentName: get(activeParentName),
                            },
                        ]);
                    }, "image/webp");
                };
                image.onerror = function () {
                    alert("Error in loading");
                };
                image.crossOrigin = ""; // if from different origin
                image.src = imgRef;
            }
            // const reader = new FileReader();
            // reader.onload = (e) => {
            //     const result = e.target?.result! as ArrayBuffer;
            //     const bytes = new Uint8Array(result);
            //     dropItems.set([
            //         ...get(dropItems),
            //         {
            //             id,
            //             name: img.name,
            //             mimeType: img.type,
            //             bytes,
            //             imgRef,
            //             parent: get(activeParentId),
            //             parentName: get(activeParentName),
            //         },
            //     ]);
            // };
            // reader.readAsArrayBuffer(img);
        }
    }
}

export function shortcutHandler(e) {
    switch (e.key) {
        case "Delete":
            if (get(editMode) === "delete") {
                get(editItems).length !== 0 && editConfirm.set(true);
            }
            break;
        case "Escape":
            if (get(editMode) === "delete") {
                get(editConfirm) === false && editMode.set("");
                editConfirm.set(false);
            }
            break;
    }
}
