import axios from "axios";
import { mainUrl } from "/src/environment";
import { readable, writable } from "svelte/store";

export const servisRemoteDatasource = (async () => {
    const store = writable({});

    const res = await axios.get(`${mainUrl}/api/laporan/servis`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })
    
    store.set(res.data.data);
    return store;
})

export const lainLainRemoteDatasource = (async () => {
    const store = writable({});

    const res = await axios.get(`${mainUrl}/api/laporan/lainlain`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    })

    store.set(res.data.data);
    return store;
})

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


