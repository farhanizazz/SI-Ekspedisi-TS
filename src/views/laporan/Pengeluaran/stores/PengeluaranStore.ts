import { LaporanPengeluaranRepository } from "/src/data/repository/laporanPengeluaranRepository";
import { writable } from "svelte/store";

export const currentPage = writable(0);
export const laporanPengeluaranData: LaporanPengeluaranRepository = new LaporanPengeluaranRepository()
export const laporanPengeluaranLainData: LaporanPengeluaranRepository = new LaporanPengeluaranRepository("lain")
export const laporanPengeluaranSemuaData: LaporanPengeluaranRepository = new LaporanPengeluaranRepository("semua")
export const selectedSopir = writable("");