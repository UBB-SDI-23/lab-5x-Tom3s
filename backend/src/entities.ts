import { ObjectId } from "mongodb";

class Box {
    constructor(
        public length: number, 
        public width: number, 
        public height: number, 
        public material: string, 
        public color: string,
        public _id?: ObjectId 
    ) {}

    getId(): ObjectId {
        if (this._id === undefined) {
            throw new Error("Supplier ID is undefined");
        }
        return this._id;
    }

    static retrieveId(obj: any): ObjectId {
        if (obj._id === undefined) {
            throw new Error("Wrapper ID is undefined");
        }
        return obj._id;
    }

    static validateDimensions(obj: any): boolean {
        if (obj.length === undefined || obj.width === undefined || obj.height === undefined) {
            return false;
        }
        return obj.length > 0 && obj.width > 0 && obj.height > 0;
    }
}

class Wrapper {
    constructor(
        public length: number,
        public width: number,
        public pattern: string,
        public color: string,
        public complementaryColor: string,
        public _id?: ObjectId
    ) {}

    static toComplexObject(obj: any, supplierId?: ObjectId): any {
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

    getId(): ObjectId {
        if (this._id === undefined) {
            throw new Error("Wrapper ID is undefined");
        }
        return this._id;
    }

    static retrieveId(obj: any): ObjectId {
        if (obj._id === undefined) {
            throw new Error("Wrapper ID is undefined");
        }
        return obj._id;
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
        public name: string,
        public address: string,
        public phone: string,
        public email: string,
        public wrappers: string[],
        public _id?: ObjectId
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


     static addWrapper(obj: any, wrapperId: string): Supplier {
        if (obj.wrappers === undefined) {
            throw new Error("Supplier wrappers is undefined");
        }
        obj.wrappers.push(wrapperId);
        return obj;
    }

    getId(): ObjectId {
        if (this._id === undefined) {
            throw new Error("Supplier ID is undefined");
        }
        return this._id;
    }

    static retrieveId(obj: any): ObjectId {
        if (obj._id === undefined) {
            throw new Error("Wrapper ID is undefined");
        }
        return obj._id;
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
        public wrapperId: string,
        public boxId: string,
        public name: string,
        public price: number,
        public _id?: ObjectId,
    ) { }

    static toComplexObject(obj: any, wrapper: Wrapper, box: Box): any {
        return {
            _id: obj._id,
            name: obj.name,
            wrapper: wrapper,
            box: box,
            price: obj.price
        };
    }

    static retrieveId(obj: any): ObjectId {
        if (obj._id === undefined) {
            throw new Error("Wrapper ID is undefined");
        }
        return obj._id;
    }
}

class AverageWrapperLength {
    constructor(
        public supplier: Supplier,
        public averageLength: number
    ) {}
}

export { Box, Wrapper, Supplier, WrapperBoxCombo, AverageWrapperLength };