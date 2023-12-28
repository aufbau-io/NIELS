import { writable } from 'svelte/store';

export const mathematics = writable(true);

export const userType = writable(null);
export const screenType = writable(null);
export const isIframe = writable(true);
export const darkMode = writable(false);
