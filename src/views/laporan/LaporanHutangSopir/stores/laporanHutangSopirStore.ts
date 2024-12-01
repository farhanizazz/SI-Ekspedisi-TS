import { LaporanHutangSopir2Repository } from "/src/data/repository/laporanHutangSopir2Repository";
import { writable } from "svelte/store";

export const currentPage = writable(0);
export const currentPageDetail = writable(0);
export const laporanHutangSopirData: LaporanHutangSopir2Repository = new LaporanHutangSopir2Repository()
export const selectedSopir = writable("");