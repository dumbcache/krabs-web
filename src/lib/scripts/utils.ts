import { goto } from "$app/navigation";
import {
    PUBLIC_KRAB_CLIENT_ID,
    PUBLIC_KRAB_API,
    PUBLIC_KRAB_NONCE_WEB,
} from "$env/static/public";

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
    goto("/d");
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

export function isLoggedin() {
    const secret = window.localStorage.getItem("secret");
    return Boolean(secret);
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
    console.log("logging user out");
    goto("/");
}
export async function clearFiles() {
    window.localStorage.clear();
    const krabsCache = await caches.open("krabs");
    const keys = await krabsCache.keys();
    keys.forEach((key) => krabsCache.delete(key));
}
