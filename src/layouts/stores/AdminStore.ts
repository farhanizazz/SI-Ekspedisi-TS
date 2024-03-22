import { writable } from 'svelte/store';

export const notificationsStore = writable([]);
export const userStore = writable<User | null>(null);
