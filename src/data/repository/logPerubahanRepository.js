import { logPerubahanService } from "../datasources/remote/log/logPerubahanDatasource";

export class LogPerubahanRepository {
    constructor() {
        this.store = new logPerubahanService();
    }

    async fetchServis() {
        await this.store.fetchLogPerubahan();
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