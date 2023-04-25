import * as dotenv from "dotenv";
import * as mongoDB from "mongodb";

import { ObjectId } from "mongodb";
import { Box, Wrapper, Supplier, WrapperBoxCombo } from "./entities";

interface IBoxRepository {
    getAll(): Promise<Box[]>;
    getById(id: ObjectId): Promise<Box | undefined>;
    add(box: Box): void;
    addBulk(boxes: Box[]): void;
    update(box: Box): void;
    delete(id: ObjectId): void;
}

class BoxRepository implements IBoxRepository {
    private boxes: mongoDB.Collection;

    constructor(box_collection: mongoDB.Collection) {
        this.boxes = box_collection;
    }

    async getAll(): Promise<Box[]> {
        const response = (this.boxes.find({}).toArray()) as unknown;
        console.log(response);
        return response as Promise<Box[]>;
    }
    
    async getById(id: ObjectId): Promise<Box | undefined> {
        const query = {_id: id};
        const response = (this.boxes.findOne(query)) as unknown;
        console.log(response);
        return response as Promise<Box | undefined>;
    }

    add(box: Box): void {
        this.boxes.insertOne(box);
    }

    addBulk(boxes: Box[]): void {
        this.boxes.insertMany(boxes);
    }

    update(box: Box): void {
        const query = {_id: box._id};
        this.boxes.updateOne(query, {$set: box});
    }

    delete(id: ObjectId): void {
        const query = {_id: id};
        this.boxes.deleteOne(query);
    }
}

interface IWrapperRepository {
    getAll(): Promise<Wrapper[]>;
    getById(id: ObjectId): Promise<Wrapper | undefined>;
    add(wrapper: Wrapper): void;
    update(wrapper: Wrapper): void;
    delete(id: ObjectId): void;
}

class WrapperRepository implements IWrapperRepository {
    private wrappers: mongoDB.Collection;

    constructor(wrapper_collection: mongoDB.Collection) {
        this.wrappers = wrapper_collection;
    }

    async getAll(): Promise<Wrapper[]> {
        const response = (this.wrappers.find({}).toArray()) as unknown;
        // console.log(await response);
        return response as Promise<Wrapper[]>;
    }

    async getById(id: ObjectId): Promise<Wrapper | undefined> {
        const query = {_id: id};
        const response = (this.wrappers.findOne(query)) as unknown;
        return response as Promise<Wrapper | undefined>;
    }

    add(wrapper: Wrapper): void {
        this.wrappers.insertOne(wrapper);
    }

    update(wrapper: Wrapper): void {
        const query = {_id: wrapper._id};
        this.wrappers.updateOne(query, {$set: wrapper});
    }

    delete(id: ObjectId): void {
        const query = {_id: id};
        this.wrappers.deleteOne(query);
    }
}

interface ISupplierRepository {
    getAll(): Promise<Supplier[]>;
    getById(id: ObjectId): Promise<Supplier | undefined>;
    add(supplier: Supplier): void;
    update(supplier: Supplier): void;
    delete(id: ObjectId): void;
    addWrapper(supplierId: ObjectId, wrapperId: string): Promise<void>;
}

class SupplierRepository implements ISupplierRepository{
    
    private suppliers: mongoDB.Collection;

    constructor(supplier_collection: mongoDB.Collection) {
        this.suppliers = supplier_collection;
    }

    async getAll(): Promise<Supplier[]> {
        const response = (this.suppliers.find({}).toArray()) as unknown;
        return response as Promise<Supplier[]>;
    }

    async getById(id: ObjectId): Promise<Supplier | undefined> {
        const query = {_id: id};
        const response = (this.suppliers.findOne(query)) as unknown;
        return response as Promise<Supplier | undefined>;
    }

    add(supplier: Supplier): void {
        this.suppliers.insertOne(supplier);
    }

    update(supplier: Supplier): void {
        const query = {_id: supplier._id};
        console.log("Updating: ", supplier);
        this.suppliers.updateOne(query, {$set: supplier});
    }

    delete(id: ObjectId): void {
        const query = {_id: id};
        this.suppliers.deleteOne(query);
    }

    async addWrapper(supplierId: ObjectId, wrapperId: string): Promise<void> {
        const supplier = await this.getById(supplierId);
        if (supplier) {
            Supplier.addWrapper(supplier, wrapperId);
            console.log(supplier);
            this.update(supplier);
        }
    }
}

interface IWrapperBoxComboRepository {
    getAll(): Promise<WrapperBoxCombo[]>;
    getById(id: ObjectId): Promise<WrapperBoxCombo | undefined>;
    add(wrapperBoxCombo: WrapperBoxCombo): void;
    update(wrapperBoxCombo: WrapperBoxCombo): void;
    delete(id: ObjectId): void;
}

class WrapperBoxComboRepository implements IWrapperBoxComboRepository {
    private combos: mongoDB.Collection;

    constructor(combo_collection: mongoDB.Collection) {
        this.combos = combo_collection;
    }

    async getAll(): Promise<WrapperBoxCombo[]> {
        const response = (this.combos.find({}).toArray()) as unknown;
        return response as Promise<WrapperBoxCombo[]>;
    }
    
    async getById(id: ObjectId): Promise<WrapperBoxCombo | undefined> {
        const query = {_id: id};
        const response = (this.combos.findOne(query)) as unknown;
        return response as Promise<WrapperBoxCombo | undefined>;
    }

    add(combo: WrapperBoxCombo): void {
        this.combos.insertOne(combo);
    }

    update(combo: WrapperBoxCombo): void {
        const query = {_id: combo._id};
        this.combos.updateOne(query, {$set: combo});
    }

    delete(id: ObjectId): void {
        const query = {_id: id};
        this.combos.deleteOne(query);
    }
}

export { BoxRepository, WrapperRepository, SupplierRepository, WrapperBoxComboRepository };
export type { IBoxRepository, IWrapperRepository, ISupplierRepository, IWrapperBoxComboRepository };