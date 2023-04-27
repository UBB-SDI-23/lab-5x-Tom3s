export class apiAccess {
    public url: string;
    constructor() {
        this.url = "http://ec2-13-48-137-148.eu-north-1.compute.amazonaws.com/api";
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