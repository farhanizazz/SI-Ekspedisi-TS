import { getLainLain, ServisService, servisPostRemoteDatasource, lainlainPostRemoteDatasource, editServisDatasource, editLainLainDatasource } from "../datasources/remote/laporan/servis/laporanServisDatasource";

export class LaporanServisRepository {
    constructor(jenis = "servis") {
        this.store = new ServisService(jenis);
    }

    async fetchServis() {
        await this.store.fetchServis();
    }

    updatePage(newPage) {
        this.store.updatePage(newPage);
    }

    updateSearch(newSearch) {
        this.store.updateSearch(newSearch);
    }

    getStore() {
        return this.store.getStore();
    }
};

export const laporanLainLainRepository = (async () => {
    let data = {};
    const store = await getLainLain();
    store.subscribe((value) => {
        data = value;
    });
    return data;
});

export const laporanServisPostRepository = async (data) => {
    let res = {};
    const store = await servisPostRemoteDatasource(data);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const editServisRepository = async (data, id) => {
    let res = {};
    const store = await editServisDatasource(data, id);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const laporanLainLainPostRepository = async (data) => {
    let res = {};
    const store = await lainlainPostRemoteDatasource(data);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const editLainLainRepository = async (data, id) => {
    let res = {};
    const store = await editLainLainDatasource(data, id);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}