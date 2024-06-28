import { lainLainRemoteDatasource, servisRemoteDatasource, servisPostRemoteDatasource, lainlainPostRemoteDatasource } from "../datasources/remote/laporan/servis/laporanServisDatasource";

export const laporanServisRepository = (async () => {
    let data = {};
    const store = await servisRemoteDatasource();
    store.subscribe((value) => {
        data = value;
    });
    return data;
});

export const laporanLainLainRepository = (async () => {
    let data = {};
    const store = await lainLainRemoteDatasource();
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

export const laporanLainLainPostRepository = async (data) => {
    let res = {};
    const store = await lainlainPostRemoteDatasource(data);
    store.subscribe((value) => {
        res = value;
    });
    return res;
}