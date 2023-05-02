export class apiAccess {
    public url: string;
    constructor() {
        this.url = "http://34.147.67.182/api";
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
        this.url += "/wrapperBoxCombos";
        return this;

    }

    id(id: string): apiAccess {
        this.url += "/" + id;
        return this;
    }

}