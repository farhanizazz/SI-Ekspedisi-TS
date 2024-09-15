import { deleteHutangSopir, getTotalHutangSopir, getTotalHutangSopirById, hutangSopirService, hutangSopirServiceId, postHutangSopir, updateHutangSopir } from "../datasources/remote/laporan/hutangSopir/hutangSopirDatasource";
import { getLainLain, ServisService, servisPostRemoteDatasource, lainlainPostRemoteDatasource, editServisDatasource, editLainLainDatasource } from "../datasources/remote/laporan/servis/laporanServisDatasource";

export class LaporanHutangSopirRepository {
    constructor() {
        this.store = new hutangSopirService();
    }

    async fetchServis() {
        await this.store.fetchHutangSopir();
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

export const hutangSopirPostRepository = async (data) => {
    let res = {};
    const store = await postHutangSopir(data);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export class LaporanHutangSopirIdRepository {
    constructor() {
        this.store = new hutangSopirServiceId();
    }

    async fetchServis(id) {
        await this.store.fetchHutangSopir(id);
    }

    updatePage(newPage) {
        this.store.updatePage(newPage);
    }

    updateSearch(newSearch) {
        this.store.updateSearch(newSearch);
    }

    getStore(id) {
        return this.store.getStore(id);
    }
};
export const updateHutangSopirRepository = async (data, id) => {
    let res = {};
    const store = await updateHutangSopir(data, id);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const deleteHutangSopirRepository = async (id) => {
    let res = {};
    const store = await deleteHutangSopir(id);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const getTotalHutangSopirRepository = async () => {
    let res = {};
    const store = await getTotalHutangSopir();
    store.subscribe((value) => {
        res = value;
    });
    return res;
}

export const getTotalHutangSopirByIdRepository = async (id) => {
    let res = {};
    const store = await getTotalHutangSopirById(id);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}