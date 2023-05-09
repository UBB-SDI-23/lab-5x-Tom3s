
class Box {
    constructor(
        public _id: number,
        public length: number, 
        public width: number, 
        public height: number, 
        public material: string, 
        public color: string
    ) {}

    static validateDimensions(obj: any): boolean {
        if (obj.length === undefined || obj.width === undefined || obj.height === undefined) {
            return false;
        }
        return obj.length > 0 && obj.width > 0 && obj.height > 0;
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
        public supplierId?: number | null
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

    static validateDimensions(obj: any): boolean {
        if (obj.length === undefined || obj.width === undefined) {
            return false;
        }
        return obj.length > 0 && obj.width > 0;
    }
}

class Supplier {
    constructor(
        public _id: number,
        public name: string,
        public address: string,
        public phone: string,
        public email: string,
        public wrappers?: number[] | Wrapper[]
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

    static validatePhoneNumber(obj: any): boolean {
        const regex = /^07[0-9]{2}( |-)[0-9]{3}( |-)?[0-9]{3}$/;
        const phoneNumber = obj.phoneNumber;
        if (!phoneNumber) {
            return false;
        }
        return regex.test(phoneNumber);
    }
}

class WrapperBoxCombo {
    constructor(
        public _id: number,
        public name: string,
        public price: number,
        public boxId?: number,
        public wrapperId?: number,
        public box?: Box,
        public wrapper?: Wrapper
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
