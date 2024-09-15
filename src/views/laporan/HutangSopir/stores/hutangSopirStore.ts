import { LaporanHutangSopirIdRepository } from "/src/data/repository/laporanHutangSopirRepository";
import { LaporanHutangSopirRepository } from "/src/data/repository/laporanHutangSopirRepository";
import { writable } from "svelte/store";

export const currentPage = writable(0);
export const currentPageDetail = writable(0);
export const hutangSopirData: LaporanHutangSopirRepository = new LaporanHutangSopirRepository()
export const hutangSopirDetailData: LaporanHutangSopirIdRepository = new LaporanHutangSopirIdRepository()
export const selectedSopir = writable("");