import { PengeluaranService } from "../datasources/remote/laporan/pengeluaran/laporanPengeluaranDatasource";

export class LaporanPengeluaranRepository {
    store: PengeluaranService;
    constructor(jenis = "servis") {
        this.store = new PengeluaranService(jenis);
    }

    async fetchServis() {
        await this.store.fetchServis();
    }

    updatePage(newPage: number) {
        this.store.updatePage(newPage);
    }

    updateSearch(newSearch: string) {
        this.store.updateSearch(newSearch);
    }

    updateTglAwal(newDate: string) {
        this.store.updateTglAwal(newDate)
    }

    updateTglAkhir(newDate: string) {
        this.store.updateTglAkhir(newDate)
    }

    getStore() {
        return this.store.getStore();
    }
};