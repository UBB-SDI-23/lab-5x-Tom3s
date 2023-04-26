export class apiAccess {
    public url: string;
    constructor() {
        this.url = "http://ec2-13-48-137-148.eu-north-1.compute.amazonaws.com/api";
    }

    boxes(): string {
        return this.url + "/boxes";
    }

    wrappers(): string {
        return this.url + "/wrappers";
    }

    suppliers(): string {
        return this.url + "/suppliers";
    }

    wrapperBoxCombos(): string {
        return this.url + "/wrapperBoxCombos";
    }

    id(id: string): string {
        return "/" + id;
    }

}