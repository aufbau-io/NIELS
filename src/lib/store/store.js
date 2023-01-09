import { writable } from 'svelte/store';

export const screenType = writable(null);
export const is_iframe = writable(true);
export const darkMode = writable(true);

export const mouseOnLink = writable(false);
