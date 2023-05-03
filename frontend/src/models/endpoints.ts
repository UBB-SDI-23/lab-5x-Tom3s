export class apiAccess {
    public url: string;
    constructor() {
        this.url = "http://34.32.135.255/api";
    }

    boxes(): apiAccess {
        this.url += "/boxes";
        return this;
    }

    wrappers(): apiAccess {
        this.url += "/wrappers";
        return this;

    }

    suppliers(): apiAccess {
        this.url += "/suppliers";
        return this;

    }

    wrapperBoxCombos(): apiAccess {
        this.url += "/combos";
        return this;

    }

    id(id: string): apiAccess {
        this.url += "/" + id;
        return this;
    }

    page(page: number): apiAccess {
        this.url += "?page=" + page;
        return this;
    }

    pageCount(): apiAccess {
        this.url += "/pages";
        return this;
    }

}