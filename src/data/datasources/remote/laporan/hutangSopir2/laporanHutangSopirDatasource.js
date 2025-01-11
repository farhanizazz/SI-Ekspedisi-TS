import axios from "axios";
import { mainUrl } from "/src/environment";
  import { getCookie } from "svelte-cookie";
  import { readable, writable } from "svelte/store";

export class laporanHutangSopirService {
    constructor() {
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.sopirId = "1";
        this.tanggalAwal = "2020-11-01"
        this.tanggalAkhir = new Date().toISOString().split("T")[0];
    }

    async fetchLaporanHutangSopir() {
        const res = await axios.get(`${mainUrl}/api/laporan-v2/hutang-sopir?page=${this.page}&search=${this.search}&sort=created_at%20ASC&sopirId=${this.sopirId}&tanggalAwal=${this.tanggalAwal}&tanggalAkhir=${this.tanggalAkhir}`, {
            headers: {
                Authorization: `Bearer ${getCookie("token")}`,
            }
        });

        this.store.set(res.data.data);
    }
    async exportLaporanHutangSopir() {
        window.open(`${mainUrl}/api/laporan-v2/hutang-sopir?page=${this.page}&search=${this.search}&sort=created_at%20ASC&sopirId=${this.sopirId}&tanggalAwal=${this.tanggalAwal}&tanggalAkhir=${this.tanggalAkhir}&export=1`)
    }

    updatePage(newPage) {
        this.page = newPage;
        // this.fetchLaporanHutangSopir();
    }

    updateSearch(newSearch) {
        this.search = newSearch;
        // this.fetchLaporanHutangSopir();
    }

    updateSopirId(newSopirId) {
        this.sopirId = newSopirId;
        // this.fetchLaporanHutangSopir();
    }

    updateTanggalAwal(newTanggal) {
        this.tanggalAwal = newTanggal;
        // this.fetchLaporanHutangSopir();
    }

    updateTanggalAkhir(newTanggal) {
        this.tanggalAkhir = newTanggal;
        // this.fetchLaporanHutangSopir();
    }

    async getStore() {
        await this.fetchLaporanHutangSopir();
        return this.store;
    }
}
