import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";

export class logPerubahanService {
    constructor() {
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.tanggalAwal = "2020-11-01"
        this.tanggalAkhir = new Date().toISOString().split("T")[0];
    }

    async fetchLogPerubahan() {
        const res = await axios.get(`${mainUrl}/api/log`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        this.store.set(res.data.data);
    }

    updatePage(newPage) {
        this.page = newPage;
        // this.fetchLaporanHutangSopir();
    }

    updateSearch(newSearch) {
        this.search = newSearch;
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
        await this.fetchLogPerubahan();
        return this.store;
    }
}
