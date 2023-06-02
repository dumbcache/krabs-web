import { get } from "svelte/store";
import {
    activeDirs,
    activeImgs,
    activeParentId,
    dataCacheName,
    refreshClicked,
} from "./stores";
import { getToken } from "./utils";

export const DIR_MIME_TYPE = "application/vnd.google-apps.folder";
export const IMG_MIME_TYPE = "image/";
export const FILE_API = "https://www.googleapis.com/drive/v3/files";
export const FIELDS_REQUIRED =
    "files(id,name,appProperties(origin),thumbnailLink)";

export const wait = (s: number) => new Promise((res) => setTimeout(res, s));

function constructAPI(
    parent: string,
    mimeType: string,
    pageSize?: number,
    pageToken?: string
) {
    let api = `${FILE_API}?q='${parent}' in parents and mimeType contains '${mimeType}'&fields=${FIELDS_REQUIRED}&pageSize=${pageSize}`;
    pageToken && (api = api + `&pageToken=` + pageToken);
    api =
        `${api}&orderBy=` +
        (mimeType === DIR_MIME_TYPE ? "name" : "createdTime desc");
    return api;
}
export async function downloadImage(id: string, token: string): Promise<Blob> {
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

export const createDir = async (
    name: string,
    parent: string,
    token: string
): Promise<any> => {
    const url = "https://www.googleapis.com/drive/v3/files/";
    let req = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parent],
        }),
    });
    let { status, statusText } = req;
    let data = (await req.json()) as CreateResourceResponse;
    if (status !== 200) {
        console.log(
            `error while creating root dir ${status} ${statusText}`,
            data
        );
        if (status === 401) {
            await getToken();

            return createDir(
                name,
                parent,
                window.localStorage.getItem("token")!
            );
        }
    }
    fetchFiles(parent, "dirs", 1000, true).then(() => window.location.reload());
};

export const updateDir = async (
    name: string,
    id: string,
    parent: string,
    token: string
): Promise<any> => {
    const url = `https://www.googleapis.com/drive/v3/files/${id}`;
    let req = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
        }),
    });
    let { status, statusText } = req;
    let data = (await req.json()) as CreateResourceResponse;
    if (status !== 200) {
        console.log(
            `error while creating root dir ${status} ${statusText}`,
            data
        );
        if (status === 401) {
            await getToken();
            return updateDir(
                name,
                id,
                parent,
                window.localStorage.getItem("token")!
            );
        }
    }
    fetchFiles(parent, "dirs", 1000, true);
    return data;
};

export const deleteDir = async (
    id: string,
    parent: string,
    token: string
): Promise<any> => {
    const url = `https://www.googleapis.com/drive/v3/files/${id}`;
    let req = await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let { status, statusText } = req;
    if (status !== 204) {
        console.log(
            `error while deleting root dir ${status} ${statusText}`,
            await req.text()
        );
        if (status === 401) {
            await getToken();
            return deleteDir(id, parent, window.localStorage.getItem("token")!);
        }
    }
    fetchFiles(parent, "dirs", 1000, true).then(() => window.location.reload());
};

export const createImgMetadata = (
    imgMeta: ImgMeta,
    token: string
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const url =
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";
        let req = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(imgMeta),
        });
        let { status, statusText } = req;
        if (status !== 200) {
            console.log(
                `error while creatingImgMetaData ${status} ${statusText}`
            );
            reject({ status });
        }
        resolve(req.headers.get("Location")!);
    });
};

export const uploadImg = async (
    location: string,
    bytes: Uint8Array
    // mimeType: string
) => {
    let req = await fetch(location, {
        method: "PUT",
        // headers: {
        //     "Content-Type": mimeType,
        // },
        body: bytes,
    });
    let { status, statusText } = req;
    if (status !== 200) {
        console.log(`error while uploadingImg ${status} ${statusText}`);
        return { status };
    }
    return { status };
};

export async function fetchFiles(
    parent: string,
    type: "dirs" | "imgs" | "covers",
    pageSize: number = 1000,
    cache: Boolean = false
): Promise<GoogleFileRes | undefined> {
    try {
        // if (!pageSize) {
        //     pageSize = mimeType === DIR_MIME_TYPE ? 1000 : 100;
        // }
        let mimeType = type == "dirs" ? DIR_MIME_TYPE : IMG_MIME_TYPE;
        const token = window.localStorage.getItem("token");
        const req = new Request(constructAPI(parent, mimeType, pageSize), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (cache) await (await caches.open(get(dataCacheName))).delete(req);
        return new Promise(async (resolve, reject) => {
            let res = await fetch(req);
            if (res.status !== 200) {
                if (res.status === 401) {
                    reject({ status: 401 });
                    return;
                }
                reject({ status: res.status });
                return;
            }
            resolve(res.json());
        });
    } catch (error) {
        console.warn(error);
    }
}

export function localFetch(url: string, krabsCache: Cache) {
    return krabsCache.match(url);
}

export async function refreshCache() {
    for (const key of await caches.keys()) {
        if (key === get(dataCacheName)) await caches.delete(key);
    }
    refreshMainContent(get(activeParentId)).then(() => {
        refreshClicked.set(false);
    });
}

export const loadMainContent = (parent: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const proms = [fetchDirs(parent!), fetchImgs(parent!)];
        Promise.any(proms)
            .then(() => {
                resolve();
            })
            .catch(async (e) => {
                if (e.status === 401) {
                    await getToken();
                    window.location.reload();
                    return;
                }
                console.warn(e);
            });
    });
};

export async function fetchDirs(parent: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fetchFiles(parent!, "dirs", 1000, true)
            .then(async (dirs) => {
                activeDirs.set(dirs?.files);
                for (let dir of dirs!.files) {
                    await fetchFiles(dir.id, "covers", 3, true);
                }
                resolve();
                return;
            })
            .catch((status) => reject(status));
    });
}
export async function fetchImgs(parent: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fetchFiles(parent!, "imgs", 1000, true)
            .then(async (imgs) => {
                activeImgs.set(imgs?.files);
                resolve();
                return;
            })
            .catch((status) => reject(status));
    });
}

export const refreshMainContent = (
    parent: string,
    type?: "dirs" | "imgs"
): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const proms: Promise<void>[] = [];
        switch (type) {
            case "dirs":
                proms.push(fetchDirs(parent));
                break;
            case "imgs":
                proms.push(fetchImgs(parent));
                break;
            default:
                proms.push(fetchDirs(parent), fetchImgs(parent));
                break;
        }

        Promise.any(proms)
            .then(() => {
                resolve();
            })
            .catch(async (e) => {
                if (e.status === 401) {
                    await getToken();
                    window.location.reload();
                    return;
                }
                console.warn(e);
            });
    });
};
