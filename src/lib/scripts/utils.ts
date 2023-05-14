import { goto } from "$app/navigation";
import {
    PUBLIC_KRAB_CLIENT_ID,
    PUBLIC_KRAB_API,
    PUBLIC_KRAB_NONCE_WEB,
} from "$env/static/public";
import { get, writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export let isLoggedin = writable(checkLoginStatus());
export let previewItem: Writable<PreviewItem | undefined> = writable(undefined);
export let dropItems = writable([]);
export let touchCoords: Writable<TouchCoords> = writable({});

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
    if (res.status !== 200) {
        if (res.status !== 401) {
            console.warn(res.status, await res.text());
            return;
        }
        console.warn(res.status, await res.text());
    }
    await clearFiles();
    isLoggedin.set(false);
    console.log("logging user out");
    goto("/");
}
export async function clearFiles() {
    window.localStorage.clear();
    const krabsCache = await caches.open("krabs");
    const keys = await krabsCache.keys();
    keys.forEach((key) => krabsCache.delete(key));
}

export function handleTouchStart(e: TouchEvent) {
    if (e.touches.length >= 2) return;
    e.stopPropagation();
    if (e.changedTouches.length === 0) return;
    const { screenX, screenY } = e.changedTouches[0];
    touchCoords.set({ startX: screenX, startY: screenY });
}
export function handleTouchEnd(e: TouchEvent, targetId: string) {
    if (e.touches.length >= 2) return;
    e.stopPropagation();
    if (e.changedTouches.length === 0) return;
    const { screenX, screenY } = e.changedTouches[0];
    touchCoords.set({ ...get(touchCoords), endX: screenX, endY: screenY });
    checkDirection(targetId);
}
export function handleTouchMouve(e: TouchEvent) {
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

export function previewChange(targetId: string, type: "PREV" | "NEXT") {
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
}
