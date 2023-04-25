import { readFileSync } from "fs";
import { Box, Wrapper, Supplier, WrapperBoxCombo } from "./entities";
import { IBoxRepository, ISupplierRepository, IWrapperRepository, IWrapperBoxComboRepository } from "./repos";
import { join } from "path";
import { ObjectId } from "mongodb";

class MockBoxRepository implements IBoxRepository {

    private boxes: Box[];

    constructor() {
        // read from file "mockBoxes.json"
        // parse json into array of Box objects
        // assign to this.boxes

        const filePath = join(__dirname, 'mockBoxes.json');
        const content = readFileSync(filePath, 'utf-8');

        this.boxes = JSON.parse(content);

        for (var i = 0; i < this.boxes.length; i++) {
            this.boxes[i]._id = new ObjectId(this.boxes[i]._id);
        }
    }

    getAll(): Promise<Box[]>{
        return Promise.resolve(this.boxes);
    }
    getById(id: ObjectId): Promise<Box | undefined>{
        return Promise.resolve(this.boxes.find(b => b._id === id));
    }
    add(box: Box): void{
        this.boxes.push(box);
    }
    addBulk(boxes: Box[]): void{
        this.boxes.push(...boxes);
    }
    update(box: Box): void{
        const index = this.boxes.findIndex(b => b._id === box._id);
        this.boxes[index] = box;
    }
    delete(id: ObjectId): void{
        const index = this.boxes.findIndex(b => b._id === id);
        this.boxes.splice(index, 1);
    }
}

class MockWrapperRepository implements IWrapperRepository {

    private wrappers: Wrapper[];

    constructor() {
        // read from file "mockWrappers.json"
        // parse json into array of Wrapper objects
        // assign to this.wrappers

        const filePath = join(__dirname, 'mockWrappers.json');
        const content = readFileSync(filePath, 'utf-8');

        this.wrappers = JSON.parse(content);

        for (var i = 0; i < this.wrappers.length; i++) {
            this.wrappers[i]._id = new ObjectId(this.wrappers[i]._id);
        }
    }

    getAll(): Promise<Wrapper[]>{
        return new Promise((resolve, reject) => {
            resolve(this.wrappers);
        });
    }
    getById(id: ObjectId): Promise<Wrapper | undefined>{
        return new Promise((resolve, reject) => {
            resolve(this.wrappers.find(w => w._id === id));
        });
    }
    add(wrapper: Wrapper): void{
        this.wrappers.push(wrapper);
    }
    update(wrapper: Wrapper): void{
        const index = this.wrappers.findIndex(w => w._id === wrapper._id);
        this.wrappers[index] = wrapper;
    }
    delete(id: ObjectId): void{
        const index = this.wrappers.findIndex(w => w._id === id);
        this.wrappers.splice(index, 1);
    }

}

class MockSupplierRepository implements ISupplierRepository {

    private suppliers: Supplier[];

    constructor() {
        // read from file "mockSuppliers.json"
        // parse json into array of Supplier objects
        // assign to this.suppliers

        const filePath = join(__dirname, 'mockSuppliers.json');
        const content = readFileSync(filePath, 'utf-8');

        this.suppliers = JSON.parse(content);

        for (var i = 0; i < this.suppliers.length; i++) {
            this.suppliers[i]._id = new ObjectId(this.suppliers[i]._id);
        }
    }

    getAll(): Promise<Supplier[]>{
        return new Promise((resolve, reject) => {
            resolve(this.suppliers);
        });
    }
    getById(id: ObjectId): Promise<Supplier | undefined>{
        return new Promise((resolve, reject) => {
            resolve(this.suppliers.find(s => s._id === id));
        });
    }
    add(supplier: Supplier): void{
        this.suppliers.push(supplier);
    }
    update(supplier: Supplier): void{
        const index = this.suppliers.findIndex(s => s._id === supplier._id);
        this.suppliers[index] = supplier;
    }
    delete(id: ObjectId): void{
        const index = this.suppliers.findIndex(s => s._id === id);
        this.suppliers.splice(index, 1);
    }
    addWrapper(supplierId: ObjectId, wrapperId: string): Promise<void>{
        const supplier = this.suppliers.find(s => s._id === supplierId);
        if (supplier) {
            supplier.wrappers.push(wrapperId);
        }
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

class MockWrapperBoxComboRepository implements IWrapperBoxComboRepository {

    private combos: WrapperBoxCombo[];

    constructor() {
        // read from file "mockCombos.json"
        // parse json into array of WrapperBoxCombo objects
        // assign to this.combos

        const filePath = join(__dirname, 'mockCombos.json');
        const content = readFileSync(filePath, 'utf-8');

        this.combos = JSON.parse(content);

        for (var i = 0; i < this.combos.length; i++) {
            this.combos[i]._id = new ObjectId(this.combos[i]._id);
        }
    }

    getAll(): Promise<WrapperBoxCombo[]>{
        return new Promise((resolve, reject) => {
            resolve(this.combos);
        });
    }

    getById(id: ObjectId): Promise<WrapperBoxCombo | undefined>{
        return new Promise((resolve, reject) => {
            resolve(this.combos.find(c => c._id === id));
        });
    }

    add(wrapperBoxCombo: WrapperBoxCombo): void{
        this.combos.push(wrapperBoxCombo);
    }

    update(wrapperBoxCombo: WrapperBoxCombo): void{
        const index = this.combos.findIndex(c => c._id === wrapperBoxCombo._id);
        this.combos[index] = wrapperBoxCombo;
    }

    delete(id: ObjectId): void{
        const index = this.combos.findIndex(c => c._id === id);
        this.combos.splice(index, 1);
    }

}

export { MockBoxRepository, MockWrapperRepository, MockSupplierRepository, MockWrapperBoxComboRepository };