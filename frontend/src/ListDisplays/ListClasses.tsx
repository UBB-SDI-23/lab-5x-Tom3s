import { apiAccess } from "../models/endpoints";
import ListDisplayTemplate from "./ListDisplayTemplate";

class BoxList extends ListDisplayTemplate {
    bulkDeletorPath: string = "/boxDeletor";
    fieldNames: string[] = ["width", "height", "length", "material", "color"];
    typeNumber: number = 1;
    typeName: string = "Box";
    getFetchUrl(): string {
        return new apiAccess().boxes().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().boxes().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().boxes().id(this.state.tempItem._id).url;
    }
    getOwnerNameUrl(ownerId: number): string {
        return new apiAccess().userName(ownerId).url;
    }
}

class WrapperList extends ListDisplayTemplate {
    bulkDeletorPath: string = "/wrapperDeletor";
    fieldNames: string[] = ["length", "width", "color", "complementarycolor", "pattern"];
    typeNumber: number = 2;
    typeName: string = "Wrapper";
    getFetchUrl(): string {
        return new apiAccess().wrappers().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().wrappers().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().wrappers().id(this.state.tempItem._id).url;
    }
    getOwnerNameUrl(ownerId: number): string {
        return new apiAccess().userName(ownerId).url;
    }
}

class SupplierList extends ListDisplayTemplate {
    bulkDeletorPath: string = "/supplierDeletor";
    fieldNames: string[] = ["name", "address", "phone", "email"];
    typeNumber: number = 3;
    typeName: string = "Supplier";
    getFetchUrl(): string {
        return new apiAccess().suppliers().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().suppliers().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().suppliers().id(this.state.tempItem._id).url;
    }
    getOwnerNameUrl(ownerId: number): string {
        return new apiAccess().userName(ownerId).url;
    }
}

class ComboList extends ListDisplayTemplate {
    bulkDeletorPath: string = "/comboDeletor";
    fieldNames: string[] = ["boxid", "wrapperid", "name", "price"];
    typeNumber: number = 4;
    typeName: string = "Combo";
    getFetchUrl(): string {
        return new apiAccess().combos().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().combos().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().combos().id(this.state.tempItem._id).url;
    }
    getOwnerNameUrl(ownerId: number): string {
        return new apiAccess().userName(ownerId).url;
    }
}

export { BoxList, WrapperList, SupplierList, ComboList };