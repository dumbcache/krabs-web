import { writable, type Writable } from "svelte/store";

export let activeParentId = writable("");
export let activeParentName = writable("");

export let tempImgs = writable<GoogleFile[] | undefined>();
export let tempDirs = writable<GoogleFile[] | undefined>();
export let activeImgs = writable<GoogleFile[] | undefined>();
export let activeDirs = writable<GoogleFile[] | undefined>();

export let recents = writable<{ name: string; id: string }[]>([]);
export let searchItems = writable<GoogleFile[] | undefined>();

export let editMode = writable(false);
export let mode = writable("");
export let editItems = writable<string[]>([]);
export let editConfirm = writable(false);
export let selectedCount = writable(0);
export let isLoggedin = writable(false);
export let activeTimeout = writable(0);
export let sessionTimeout = writable(false);
export let dataCacheName = writable("");
export let refreshClicked = writable(false);

export let previewItem: Writable<PreviewItem | undefined> = writable(undefined);
export let dropMini = writable(false);
export let dropItems: Writable<DropItem[]> = writable([]);
export let touchCoords: Writable<TouchCoords> = writable({});
