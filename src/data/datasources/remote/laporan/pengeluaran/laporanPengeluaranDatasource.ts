import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";

export class PengeluaranService {
    store: import("svelte/store").Writable<{}>;
    page: number;
    search: string;
    jenis: string;
    tglAwal: string;
    tglAkhir: string;
    constructor(jenis = "semua") {
        let today = new Date();
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.jenis = jenis;
        this.tglAwal = today.toISOString().substring(0, 10);
        this.tglAkhir = today.toISOString().substring(0, 10);
    }

    

    async fetchServis() {
        const res = await axios.get(`${mainUrl}/api/laporan/pengeluaran-${this.jenis}?tanggal_awal=${this.tglAwal}&tanggal_akhir=${this.tglAkhir}&page=${this.page + 1}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        this.store.set(res.data.data);
    }

    updatePage(newPage: number) {
        this.page = newPage;
        // this.fetchServis();
    }

    updateSearch(newSearch: string) {
        this.search = newSearch;
        // this.fetchServis();
    }

    updateTglAwal(newDate: string) {
        this.tglAwal = newDate
        // this.fetchServis();
    }

    updateTglAkhir(newDate: string) {
        this.tglAkhir = newDate
        // this.fetchServis();
    }

    async getStore() {
        await this.fetchServis();
        return this.store;
    }
}

