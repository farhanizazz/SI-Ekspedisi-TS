import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";

export class ServisService {
    constructor(jenis = "servis") {
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.jenis = jenis;
    }

    async fetchServis() {
        const res = await axios.get(`${mainUrl}/api/laporan/${this.jenis}?sort=created_at%20ASC&page=${this.page}&search=${this.search}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        this.store.set(res.data.data);
    }

    updatePage(newPage) {
        this.page = newPage;
        this.fetchServis();
    }

    updateSearch(newSearch) {
        this.search = newSearch;
        this.fetchServis();
    }

    async getStore() {
        await this.fetchServis();
        return this.store;
    }
}

export const getLainLain = async () => {
    const store = writable({});

    const res = await axios.get(`${mainUrl}/api/laporan/lainlain`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })

    store.set(res.data.data);
    return store;
}

export const servisPostRemoteDatasource = async (data) => {
    const store = writable({});
    const res = await axios.post(`${mainUrl}/api/laporan/servis`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const editServisDatasource = async (data, id) => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/laporan/servis/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const lainlainPostRemoteDatasource = async (data) => {
    const store = writable({});
    const res = await axios.post(`${mainUrl}/api/laporan/lainlain`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const editLainLainDatasource = async (data, id) => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/laporan/lainlain/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}


