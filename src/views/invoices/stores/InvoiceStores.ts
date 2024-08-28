import { writable } from "svelte/store";

export const currentPage = writable(0);
export const search = writable("");
export const transaksi = writable([]);
export const invoices = writable([]);
export const isDataValid = writable(false);


