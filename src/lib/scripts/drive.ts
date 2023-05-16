import { getToken } from "./utils";

export const DIR_MIME_TYPE = "application/vnd.google-apps.folder";
export const IMG_MIME_TYPE = "image/";
export const FILE_API = "https://www.googleapis.com/drive/v3/files";
export const FIELDS_REQUIRED =
    "files(id,name,appProperties(origin),thumbnailLink)";

function constructAPI(
    parent: string,
    mimeType: string,
    pageSize?: number,
    pageToken?: string
) {
    let api = `${FILE_API}?q='${parent}' in parents and mimeType contains '${mimeType}'&fields=${FIELDS_REQUIRED}&pageSize=${pageSize}`;
    pageToken && (api = api + `&pageToken=` + pageToken);
    mimeType === DIR_MIME_TYPE && (api = api + "&orderBy=name");
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

const wait = (s: number) => new Promise((res) => setTimeout(res, s));

export async function fetchFromDrive(
    parent: string,
    token: string,
    mimeType: string,
    pageSize?: number
): Promise<Response | undefined> {
    try {
        if (!pageSize) {
            pageSize = mimeType === DIR_MIME_TYPE ? 1000 : 100;
        }
        return new Promise(async (resolve, reject) => {
            let res = await fetch(constructAPI(parent, mimeType, pageSize), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status !== 200) {
                if (res.status === 401) {
                    reject({ status: 401 });
                    return;
                }
                reject({ status: res.status });
                return;
            }
            // const data = (await res.json()) as GoogleFileRes;
            resolve(res);
        });
    } catch (error) {
        console.warn(error);
    }
}

export function localFetch(url: string, krabsCache: Cache) {
    return krabsCache.match(url);
}

export async function refreshCache(
    parent: string,
    type: "dirs" | "imgs" | "covers",
    pageSize: number = 1000
): Promise<GoogleFileRes> {
    const krabsCache = await caches.open("krabs");
    const path = `/${parent}?type=${type}`;
    const token = window.localStorage.getItem("token")!;
    return new Promise((resolve, reject) => {
        fetchFromDrive(
            parent,
            token,
            type == "dirs" ? DIR_MIME_TYPE : IMG_MIME_TYPE,
            pageSize
        )
            .then((res) => {
                krabsCache.put(path, res!.clone());
                resolve(res!.json());
            })
            .catch((e) => {
                reject(e);
            });
    });
}

export function fetchFiles(
    parent: string,
    type: "dirs" | "imgs" | "covers",
    pageSize?: number
): Promise<GoogleFileRes> {
    // if (!pageSize) {
    // pageSize = type === "dirs" ? 1000 : 100;
    // }
    return new Promise(async (resolve, reject) => {
        const krabsCache = await caches.open("krabs");
        const path = `/${parent}?type=${type}`;
        const cacheData = await localFetch(path, krabsCache);
        if (cacheData) {
            resolve(cacheData.json());
            return;
        }
        refreshCache(parent, type, pageSize)
            .then((res) => resolve(res))
            .catch((e) => reject(e));
    });
}

export const loadMainContent = (
    parent: string
): Promise<{
    dirs: GoogleFileRes | undefined;
    imgs: GoogleFileRes | undefined;
}> => {
    return new Promise(async (resolve, reject) => {
        const promises = [
            fetchFiles(parent!, "dirs"),
            fetchFiles(parent!, "imgs"),
        ];
        Promise.all(promises)
            .then(([dirs, imgs]) => {
                resolve({ dirs, imgs });
            })
            .catch(async (e) => {
                if (e.status === 401) {
                    await getToken();
                }
                console.warn(e);
            });
    });
};
export const refreshMainContent = (
    parent: string
): Promise<{
    dirs: GoogleFileRes | undefined;
    imgs: GoogleFileRes | undefined;
}> => {
    return new Promise(async (resolve, reject) => {
        const promises = [
            refreshCache(parent!, "dirs"),
            refreshCache(parent!, "imgs"),
        ];
        Promise.all(promises)
            .then(async ([dirs, imgs]) => {
                resolve({ dirs, imgs });
                for (let dir of dirs.files) {
                    await refreshCache(dir.id, "covers", 3);
                }
                window.location.reload();
                return;
            })
            .catch(async (e) => {
                if (e.status === 401) {
                    await getToken();
                }
                console.warn(e);
            });
    });
};
