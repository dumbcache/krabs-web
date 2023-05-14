// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface Platform {}
    }
    interface Window {
        google: any;
    }
    interface GoogleSignInPayload {
        credential: string;
        select_by: string;
    }
    interface GoogleFile {
        id: string;
        name: string;
        parents: string[];
        thumbnailLink?: string;
        // hasThumbnail: string;
        // mimeType: string;
        // createdTime: string;
        // modifiedTime: string;
        appProperties: {
            origin: string;
            src: string;
        };
    }

    interface GoogleFileRes {
        files: GoogleFile[];
        nextPageToken?: string;
    }

    interface ImgMeta {
        name?: string;
        mimeType?: string;
        parents?: [string];
        appProperties?: {
            origin?: string;
            src?: string;
        };
    }

    interface CreateResourceResponse {
        kind: string;
        id: string;
        name: string;
        mimeType: string;
    }

    interface PreviewItem {
        src: string;
        id: string;
        url?: string;
    }
    interface TouchCoords {
        startX?: number;
        startY?: number;
        endX?: number;
        endY?: number;
    }
    interface DropItem {
        name: string;
        mimeType: string;
        url?: string;
        bytes: Uint8Array;
        imgRef: string;
    }

    interface DropItems {
        [id: number]: DropItem;
    }
}

export {};
