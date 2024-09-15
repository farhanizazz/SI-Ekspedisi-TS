import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";

export class hutangSopirService {
    constructor() {
        this.store = writable({});
        this.page = 0;
        this.search = "";
    }

    async fetchHutangSopir() {
        const res = await axios.get(`${mainUrl}/api/transaksi/hutang-sopir/total/?page=${this.page}&search=${this.search}&sort=created_at%20ASC`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        this.store.set(res.data.data);
    }

    updatePage(newPage) {
        this.page = newPage;
        this.fetchHutangSopir();
    }

    updateSearch(newSearch) {
        this.search = newSearch;
        this.fetchHutangSopir();
    }

    async getStore() {
        await this.fetchHutangSopir();
        return this.store;
    }
}

export const postHutangSopir = async (data) => {
    const store = writable({});
    const res = await axios.post(`${mainUrl}/api/laporan/servis`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export class hutangSopirServiceId {
    constructor() {
        this.store = writable({});
        this.page = 0;
        this.search = "";
    }

    async fetchHutangSopir(id) {
        this.id = id;
        const res = await axios.get(`${mainUrl}/api/transaksi/hutang-sopir/${this.id}/list?itemPerPage=10&page=${this.page}&sort=created_at%20ASC&search=${this.search}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        this.store.set(res.data.data);
    }

    updatePage(newPage) {
        this.page = newPage;
        this.fetchHutangSopir(this.id);
    }

    updateSearch(newSearch) {
        this.search = newSearch;
        this.fetchHutangSopir(this.id);
    }

    async getStore(id) {
        await this.fetchHutangSopir(id);
        return this.store;
    }
}

export const updateHutangSopir = async (data, id) => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/transaksi/hutang-sopir/${id}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const deleteHutangSopir = async (id) => {
    const store = writable({});
    const res = await axios.delete(`${mainUrl}/api/transaksi/hutang-sopir/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const getTotalHutangSopir = async () => {
    const store = writable({});
    const res = await axios.put(`${mainUrl}/api/transaksi/hutang-sopir/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

export const getTotalHutangSopirById = async (id) => {
    const store = writable({});
    const res = await axios.get(`${mainUrl}/api/transaksi/hutang-sopir/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    store.set(res.data);
    return store;
}

