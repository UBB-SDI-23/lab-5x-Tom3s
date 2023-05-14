
class Box {
    constructor(
        public _id: number,
        public length: number, 
        public width: number, 
        public height: number, 
        public material: string, 
        public color: string,
        public ownerid?: number
    ) {}

    static validateDimensions(obj: Box): void {
        // return obj.length > 0 && obj.width > 0 && obj.height > 0;
        var invalidDimensions = [];
        if (obj.length <= 0) {
            invalidDimensions.push("length");
        }
        if (obj.width <= 0) {
            invalidDimensions.push("width");
        }
        if (obj.height <= 0) {
            invalidDimensions.push("height");
        }
        if (invalidDimensions.length > 0) {
            throw new Error("The following dimensions are invalid: " + invalidDimensions.join(", "));
        }            
    }

    static checkEmpty(obj: any): void {
        var emptyFields = [];
        if (obj.length === undefined || obj.length === null) {
            emptyFields.push("length");
        }
        if (obj.width === undefined || obj.width === null) {
            emptyFields.push("width");
        }
        if (obj.height === undefined || obj.height === null) {
            emptyFields.push("height");
        }
        if (obj.material === undefined || obj.material === null || obj.material === "") {
            emptyFields.push("material");
        }
        if (obj.color === undefined || obj.color === null || obj.color === "") {
            emptyFields.push("color");
        }
        if (emptyFields.length > 0) {
            throw new Error("A Box must have the following fields: " + emptyFields.join(", "));
        }
    }
}

class Wrapper {
    constructor(
        public _id: number,
        public length: number,
        public width: number,
        public pattern: string,
        public color: string,
        public complementaryColor: string,
        public supplierId?: number | null,
        public ownerid?: number
    ) {}

    static toComplexObject(obj: any, supplierId?: number): any {
        return {
            _id: obj._id,
            length: obj.length,
            width: obj.width,
            pattern: obj.pattern,
            color: obj.color,
            complementaryColor: obj.complementaryColor,
            supplierId: supplierId
        };
    }

    static toNestedObject(obj: any, supplier: Supplier): any {
        return {
            _id: obj._id,
            length: obj.length,
            width: obj.width,
            pattern: obj.pattern,
            color: obj.color,
            complementaryColor: obj.complementaryColor,
            supplier: Supplier.toSimpleObject(supplier)
        };
    }

    static validateDimensions(obj: Wrapper): void {
        // return obj.length > 0 && obj.width > 0;
        var invalidDimensions = [];
        if (obj.length <= 0) {
            invalidDimensions.push("length");
        }
        if (obj.width <= 0) {
            invalidDimensions.push("width");
        }
        if (invalidDimensions.length > 0) {
            throw new Error("The following dimensions are invalid: " + invalidDimensions.join(", "));
        }
    }

    static checkEmpty(obj: any): void {
        var emptyFields = [];
        if (obj.length === undefined || obj.length === null) {
            emptyFields.push("length");
        }
        if (obj.width === undefined || obj.width === null) {
            emptyFields.push("width");
        }
        if (obj.pattern === undefined || obj.pattern === null || obj.pattern === "") {
            emptyFields.push("pattern");
        }
        if (obj.color === undefined || obj.color === null || obj.color === "") {
            emptyFields.push("color");
        }
        if (obj.complementaryColor === undefined || obj.complementaryColor === null || obj.complementaryColor === "") {
            emptyFields.push("complementarycolor");
        }
        if (emptyFields.length > 0) {
            throw new Error("A Wrapper must have the following fields: " + emptyFields.join(", "));
        }
    }
}

class Supplier {
    constructor(
        public _id: number,
        public name: string,
        public address: string,
        public phone: string,
        public email: string,
        public wrappers?: number[] | Wrapper[],
        public ownerid?: number
    ) {}

    static toSimpleObject(s: any): any {
        return {
            _id: s._id,
            name: s.name,
            address: s.address,
            phone: s.phone,
            email: s.email
        };
    }

    static validatePhoneNumber(obj: Supplier): void {
        const regex = /^07[0-9]{2}( |-)[0-9]{3}( |-)?[0-9]{3}$/;
        const phoneNumber = obj.phone;
        
        if (!regex.test(phoneNumber)) {
            throw new Error("Invalid phone number (must be in the format 07XX XXX XXX or 07XX-XXX-XXX)");
        }
    }

    static validateEmail(obj: any): void {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const email = obj.email;

        if (!regex.test(email)) {
            throw new Error("Invalid email address");
        }
    }

    static checkEmpty(obj: any): void {
        var emptyFields = [];
        if (obj.name === undefined || obj.name === null || obj.name === "") {
            emptyFields.push("name");
        }
        if (obj.address === undefined || obj.address === null || obj.address === "") {
            emptyFields.push("address");
        }
        if (obj.phone === undefined || obj.phone === null || obj.phone === "") {
            emptyFields.push("phone");
        }
        if (obj.email === undefined || obj.email === null || obj.email === "") {
            emptyFields.push("email");
        }
        if (emptyFields.length > 0) {
            throw new Error("A Supplier must have the following fields: " + emptyFields.join(", "));
        }
    }
}

class WrapperBoxCombo {
    constructor(
        public _id: number,
        public name: string,
        public price: number,
        public boxid?: number,
        public wrapperid?: number,
        public box?: Box,
        public wrapper?: Wrapper,
        public ownerid?: number
    ) { }

    static toComplexObject(obj: any, wrapper: Wrapper, box: Box): WrapperBoxCombo {
        return {
            _id: obj._id,
            name: obj.name,
            wrapper: wrapper,
            box: box,
            price: obj.price
        } as WrapperBoxCombo;
    }

    static validatePrice(obj: WrapperBoxCombo): void {
        if (!isNaN(obj.price)){
            throw new Error("Price must be a number");
        }
        if (obj.price <= 0) {
            throw new Error("Price must be greater than 0");
        }
        if (obj.price.toFixed(2).split(".")[1].length > 2) {
            throw new Error("Price must have at most 2 decimal places");
        }
    }

    static checkEmpty(obj: any): void {
        var emptyFields = [];
        if (obj.name === undefined || obj.name === null || obj.name === "") {
            emptyFields.push("name");
        }
        if (obj.price === undefined || obj.price === null) {
            emptyFields.push("price");
        }
        if (emptyFields.length > 0) {
            throw new Error("A WrapperBoxCombo must have the following fields: " + emptyFields.join(", "));
        }
    }
}

class AverageWrapperLength {
    constructor(
        public supplier: Supplier,
        public averageLength: number | null
    ) {}
}

interface SuppliedWrapper {
    supplierId: number;
    wrapperId: number;
}

interface IBoxRepository {
    getAll(): Promise<Box[]>;
    getPage(page: number, pageLength: number): Promise<Box[]>;
    getById(id: number): Promise<Box | undefined>;
    add(box: Box): void;
    addBulk(boxes: Box[]): void;
    update(box: Box): void;
    delete(id: number): void;
    getSize(): Promise<number>;
}

interface IWrapperRepository {
    getAll(): Promise<Wrapper[]>;
    getPage(page: number, pageLength: number): Promise<Wrapper[]>;
    getById(id: number): Promise<Wrapper | undefined>;
    add(wrapper: Wrapper): void;
    update(wrapper: Wrapper): void;
    delete(id: number): void;
    getSize(): Promise<number>;
}

interface ISupplierRepository {
    getAll(): Promise<Supplier[]>;
    getPage(page: number, pageLength: number): Promise<Supplier[]>;
    getById(id: number): Promise<Supplier | undefined>;
    add(supplier: Supplier): void;
    update(supplier: Supplier): void;
    delete(id: number): void;
    getSize(): Promise<number>;
    addWrapper(supplierId: number, wrapperId: string): Promise<void>;
}

interface IWrapperBoxComboRepository {
    getAll(): Promise<WrapperBoxCombo[]>;
    getPage(page: number, pageLength: number): Promise<WrapperBoxCombo[]>;
    getById(id: number): Promise<WrapperBoxCombo | undefined>;
    add(wrapperBoxCombo: WrapperBoxCombo): void;
    update(wrapperBoxCombo: WrapperBoxCombo): void;
    delete(id: number): void;
    getSize(): Promise<number>;
}

export { Box, Wrapper, Supplier, WrapperBoxCombo, AverageWrapperLength };
export type { IBoxRepository, IWrapperRepository, ISupplierRepository, IWrapperBoxComboRepository, SuppliedWrapper };
