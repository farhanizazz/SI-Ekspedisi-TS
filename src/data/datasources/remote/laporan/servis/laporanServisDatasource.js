import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";
import { getCookie } from "svelte-cookie";


export class ServisService {
    constructor(jenis = "servis") {
        this.store = writable({});
        this.page = 0;
        this.search = "";
        this.jenis = jenis;
    }

    async fetchServis() {
        const res = await axios.get(`${mainUrl}/api/master/laporan/${this.jenis}?sort=created_at%20ASC&page=${this.page}&search=${this.search}`, {
            headers: {
                Authorization: `Bearer ${getCookie('token')}`,
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

    const res = await axios.get(`${mainUrl}/api/master/laporan/lainlain`, {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
        }
    })

    store.set(res.data.data);
    return store;
}

export const servisPostRemoteDatasource = async (data) => {
    const store = writable({});
    const res = await axios.post(`${mainUrl}/api/master/laporan/servis`, data, {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
        }
    })
    store.set(res.data);
    return store;
}

export const editServisDatasource = async (data, id) => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/master/laporan/servis/${id}`, data, {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
        }
    })
    store.set(res.data);
    return store;
}

export const lainlainPostRemoteDatasource = async (data) => {
    const store = writable({});
    const res = await axios.post(`${mainUrl}/api/master/laporan/lainlain`, data, {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
        }
    })
    store.set(res.data);
    return store;
}

export const editLainLainDatasource = async (data, id) => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/master/laporan/lainlain/${id}`, data, {
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
        }
    })
    store.set(res.data);
    return store;
}


