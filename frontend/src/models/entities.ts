export interface Box {
    _id: string;
    length: number; 
    width: number;
    height: number; 
    material: string; 
    color: string;
}

export interface Wrapper {
    _id: string;
    length: number;
    width: number;
    pattern: string;
    color: string;
    complementaryColor: string;
}

export interface Supplier {
    _id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    wrappers: string[];
}

export interface WrapperBoxCombo {
    _id: string;
    wrapperId: string;
    boxId: string;
    name: string;
    price: number;
}