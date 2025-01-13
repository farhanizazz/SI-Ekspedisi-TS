import axios from "axios";
import { mainUrl } from "/src/environment";
import { getCookie } from "svelte-cookie";
import { readable, writable } from "svelte/store";

export class PengeluaranService {
    store: import("svelte/store").Writable<{}>;
    page: number;
    search: string;
    jenis: string;
    tglAwal: string;
    tglAkhir: string;
    selectedArmadas: Array<string>;
    constructor(jenis = "semua") {
        let today = new Date();
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.jenis = jenis;
        this.tglAwal = today.toISOString().substring(0, 10);
        this.tglAkhir = today.toISOString().substring(0, 10);
        this.selectedArmadas = []
    }

    

    async fetchServis() {
        const res = await axios.get(`${mainUrl}/api/laporan/pengeluaran-${this.jenis}?tanggal_awal=${this.tglAwal}&tanggal_akhir=${this.tglAkhir}&page=${this.page + 1}&m_armada_id=[${this.selectedArmadas == null ? '' : this.selectedArmadas}]`, {
            headers: {
                Authorization: `Bearer ${getCookie("token")}`,
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

    updateSelectedArmadas(newArmada: Array<string>) {
        if(newArmada == null) {
            this.selectedArmadas = ['']
        }
        this.selectedArmadas = newArmada
    }

    async getStore() {
        await this.fetchServis();
        return this.store;
    }
}

