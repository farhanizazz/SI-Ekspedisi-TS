import { lainLainRemoteDatasource, servisRemoteDatasource } from "../datasources/remote/laporan/servis/laporanServisDatasource";

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