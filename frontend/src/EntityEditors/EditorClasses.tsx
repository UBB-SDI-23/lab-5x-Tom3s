import { apiAccess } from "../models/endpoints";
import ItemEditor from "./ItemEditor";

class BoxEditor extends ItemEditor {
    input1stRow: any[] = [
        {
            name: "length",
            type: "number",
        },
        {
            name: "width",
            type: "number",
        },
        {
            name: "height",
            type: "number",
        }
    ];
    input2ndRow: any[] = [
        {
            name: "color",
            type: "text",
        },
        {
            name: "material",
            type: "text",
        }
    ];
    input3rdRow: any[] = [];
    itemType: string = "Box";
    typeNumber: number = 1;
    getFetchItemUrl(): string {
        return new apiAccess().boxes().id(this.itemid).url;
    }
    getSubmitUrl(): string {
        if (this.itemid === "") {
            return new apiAccess().boxes().url;
        }
        else {
            return new apiAccess().boxes().id(this.itemid).url;
        }
    }
    getSubmitOptions(item: any) {
        const method = this.itemid === "" ? "POST" : "PUT";
        const body = JSON.stringify({
            length: item.length,
            width: item.width,
            height: item.height,
            color: item.color,
            material: item.material
        });
        const headers = {
            "Content-Type": "application/json",
            "sessiontoken": localStorage.getItem("sessiontoken") || ""
        };

        return { 
            method: method,
            headers: headers,
            body: body
         };
    }
}

class WrapperEditor extends ItemEditor {
    input1stRow: any[] = [
        {
            name: "length",
            type: "number"
        },
        {
            name: "width",
            type: "number"
        }
    ];
    input2ndRow: any[] = [
        {
            name: "color",
            type: "text"
        },
        {
            name: "complementarycolor",
            type: "text"
        }
    ]
    input3rdRow: any[] = [
        {
            name: "pattern",
            type: "text",
        }
    ]
    itemType: string = "Wrapper";
    typeNumber: number = 2;
    getFetchItemUrl(): string {
        return new apiAccess().wrappers().id(this.itemid).url;
    }
    getSubmitUrl(): string {
        if (this.itemid === "") {
            return new apiAccess().wrappers().url;
        }
        else {
            return new apiAccess().wrappers().id(this.itemid).url;
        }
    }
    getSubmitOptions(item: any) {
        const method = this.itemid === "" ? "POST" : "PUT";
        const body = JSON.stringify({
            length: item.length,
            width: item.width,
            color: item.color,
            complementarycolor: item.complementarycolor,
            pattern: item.pattern
        });
        const headers = {
            "Content-Type": "application/json",
            "sessiontoken": localStorage.getItem("sessiontoken") || ""
        };

        return { 
            method: method,
            headers: headers,
            body: body
         };
    }
}

class SupplierEditor extends ItemEditor {
    input1stRow: any[] = [
        {
            name: "name",
            type: "text"
        },
        {
            name: "email",
            type: "text"
        }
    ];
    input2ndRow: any[] = [
        {
            name: "address",
            type: "text"
        },
        {
            name: "phone",
            type: "text"
        }
    ];  
    input3rdRow: any[] = [];
    itemType: string = "Supplier";
    typeNumber: number = 3;
    getFetchItemUrl(): string {
        return new apiAccess().suppliers().id(this.itemid).url;
    }
    getSubmitUrl(): string {
        if (this.itemid === "") {
            return new apiAccess().suppliers().url;
        }
        else {
            return new apiAccess().suppliers().id(this.itemid).url;
        }
    }
    getSubmitOptions(item: any) {
        const method = this.itemid === "" ? "POST" : "PUT";
        const body = JSON.stringify({
            name: item.name,
            email: item.email,
            address: item.address,
            phone: item.phone
        });
        const headers = {
            "Content-Type": "application/json",
            "sessiontoken": localStorage.getItem("sessiontoken") || ""
        };

        return { 
            method: method,
            headers: headers,
            body: body
         };
    }
}

class ComboEditor extends ItemEditor {
    input1stRow: any[] = [
        {
            name: "boxid",
            type: "number"
        },
        {
            name: "wrapperid",
            type: "number"
        }
    ];
    input2ndRow: any[] = [
        {
            name: "name",
            type: "text"
        },
        {
            name: "price",
            type: "number"
        }
    ]
    input3rdRow: any[] = [];
    itemType: string = "Combo";
    typeNumber: number = 4;
    getFetchItemUrl(): string {
        return new apiAccess().combos().id(this.itemid).url;
    }
    getSubmitUrl(): string {
        if (this.itemid === "") {
            return new apiAccess().combos().url;
        }
        else {
            return new apiAccess().combos().id(this.itemid).url;
        }
    }
    getSubmitOptions(item: any) {
        const method = this.itemid === "" ? "POST" : "PUT";
        const body = JSON.stringify({
            boxid: item.boxid,
            wrapperid: item.wrapperid,
            name: item.name,
            price: item.price
        });
        const headers = {
            "Content-Type": "application/json",
            "sessiontoken": localStorage.getItem("sessiontoken") || ""
        };

        return { 
            method: method,
            headers: headers,
            body: body
         };
    }
}

export { ItemEditor, BoxEditor, WrapperEditor, SupplierEditor, ComboEditor };