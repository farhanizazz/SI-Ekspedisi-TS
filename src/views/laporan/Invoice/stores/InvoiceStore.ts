import { LaporanServisRepository } from "/src/data/repository/laporanServisRepository";
import { writable } from "svelte/store";

export const currentPage = writable(0);
export const laporanServisData: LaporanServisRepository = new LaporanServisRepository()
export const laporanLainData: LaporanServisRepository = new LaporanServisRepository("lainlain")
export const selectedSopir = writable("");