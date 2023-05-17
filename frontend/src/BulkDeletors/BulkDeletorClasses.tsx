import { apiAccess } from "../models/endpoints";
import BulkDeletorTemplate from "./BulkDeletorTemplate";

class BoxBulkDeletor extends BulkDeletorTemplate {
    typeNumber: number = 1;
    fieldNames: string[] = ["width", "height", "length", "material", "color"];
    typeName: string = "Box";
    getFetchUrl(): string {
        return new apiAccess().boxes().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().boxes().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().boxes().url;
    }
}

class WrapperBulkDeletor extends BulkDeletorTemplate {
    typeNumber: number = 2;
    fieldNames: string[] = ["length", "width", "color", "complementarycolor", "pattern"];
    typeName: string = "Wrapper";
    getFetchUrl(): string {
        return new apiAccess().wrappers().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().wrappers().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().wrappers().url;
    }
}

class SupplierBulkDeletor extends BulkDeletorTemplate {
    typeNumber: number = 3;
    fieldNames: string[] = ["name", "address", "phone", "email"];
    typeName: string = "Supplier";
    getFetchUrl(): string {
        return new apiAccess().suppliers().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().suppliers().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().suppliers().url;
    }
}

class ComboBulkDeletor extends BulkDeletorTemplate {
    typeNumber: number = 4;
    fieldNames: string[] = ["boxid", "wrapperid", "name", "price"];
    typeName: string = "Combo";
    getFetchUrl(): string {
        return new apiAccess().combos().page(this.state.page).url;
    }
    getFetchPageCountUrl(): string {
        return new apiAccess().combos().pageCount().url;
    }
    getDeleteItemUrl(): string {
        return new apiAccess().combos().url;
    }
}

export { BoxBulkDeletor, WrapperBulkDeletor, SupplierBulkDeletor, ComboBulkDeletor };
