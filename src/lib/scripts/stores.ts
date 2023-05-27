import { writable, type Writable } from "svelte/store";

export let activeParentId = writable("");
export let activeParentName = writable("");
export let activeImgs = writable<GoogleFile[]>([]);
export let activeDirs = writable<GoogleFile[]>([]);

export let isLoggedin = writable(false);
export let renameid = writable("");
export let renameValue = writable("");

export let previewItem: Writable<PreviewItem | undefined> = writable(undefined);
export let dropItems: Writable<DropItem[]> = writable([]);
export let touchCoords: Writable<TouchCoords> = writable({});
