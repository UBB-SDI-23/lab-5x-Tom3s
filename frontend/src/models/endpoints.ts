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

    combos(): apiAccess {
        this.url += "/combos";
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

    register(): apiAccess {
        this.url += "/register";
        return this;
    }
    
    login(): apiAccess {
        this.url += "/login";
        return this;
    }

    confirm(token: string): apiAccess {
        this.url += "/register/" + token;
        return this;
    }

    userWithDetails(id: number) {
        this.url += "/users/" + id + "?lists=true";
        return this;
    }

    userWithoutDetails(id: number) {
        this.url += "/users/" + id;
        return this;
    }

    userName(id: number) {
        this.url += "/users/name/" + id;
        return this;
    }
}