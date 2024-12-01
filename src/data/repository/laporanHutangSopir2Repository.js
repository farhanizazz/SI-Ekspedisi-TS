import { laporanHutangSopirService } from "../datasources/remote/laporan/hutangSopir2/laporanHutangSopirDatasource";

export class LaporanHutangSopir2Repository {
    constructor() {
        this.store = new laporanHutangSopirService();
    }

    async fetchServis() {
        await this.store.fetchLaporanHutangSopir();
    }

    updatePage(newPage) {
        this.store.updatePage(newPage);
    }

    updateSearch(newSearch) {
        this.store.updateSearch(newSearch);
    }

    updateSopirId(newSopirId) {
        this.store.updateSopirId(newSopirId);
    }

    updateTanggalAwal(newTanggal) {
        this.store.updateTanggalAwal(newTanggal);
    }

    updateTanggalAkhir(newTanggal) {
        this.store.updateTanggalAkhir(newTanggal);
    }

    getStore() {
        return this.store.getStore();
    }
};