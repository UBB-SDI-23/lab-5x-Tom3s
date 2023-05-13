import { apiAccess } from "../models/endpoints";
import ListDisplayTemplate from "./ListDisplayTemplate";

class BoxList extends ListDisplayTemplate {
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

export default BoxList;