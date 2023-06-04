import { writable, type Writable } from "svelte/store";

export let activeParentId = writable("");
export let activeParentName = writable("");
export let activeImgs = writable<GoogleFile[] | undefined>();
export let activeDirs = writable<GoogleFile[] | undefined>();
export let recents = writable<{ name: string; id: string }[]>([]);
export let searchItems = writable<GoogleFile[] | undefined>();

export let editMode = writable("");
export let mode = writable("");
export let editItems = writable<string[]>([]);
export let editConfirm = writable(false);
export let selectedCount = writable(0);
export let isLoggedin = writable(false);
export let dataCacheName = writable("");
export let refreshClicked = writable(false);

export let previewItem: Writable<PreviewItem | undefined> = writable(undefined);
export let dropMini = writable(false);
export let dropItems: Writable<DropItem[]> = writable([]);
export let touchCoords: Writable<TouchCoords> = writable({});
