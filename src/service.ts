import { writeFileSync } from "fs";
import { ObjectId } from "mongodb";
import { Box, Wrapper, Supplier, WrapperBoxCombo, AverageWrapperLength } from "./entities";
import { BoxRepository, WrapperRepository, SupplierRepository, WrapperBoxComboRepository, IBoxRepository, ISupplierRepository, IWrapperBoxComboRepository, IWrapperRepository } from "./repos";


function deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

class Service {
    private boxRepository: IBoxRepository;
    private wrapperRepository: IWrapperRepository;
    private supplierRepository: ISupplierRepository;
    private comboRepository: IWrapperBoxComboRepository;

    constructor(boxRepo?: IBoxRepository, wrapperRepo?: IWrapperRepository, supplierRepo?: ISupplierRepository, comboRepo?: IWrapperBoxComboRepository) {        
        if (!boxRepo || !wrapperRepo || !supplierRepo || !comboRepo) {
            throw new Error("Error: Missing repositories");
        }

        this.boxRepository = boxRepo;
        this.wrapperRepository = wrapperRepo;
        this.supplierRepository = supplierRepo;
        this.comboRepository = comboRepo;
    }

    async getAllBoxes(): Promise<Box[]> {
        return this.boxRepository.getAll();
    }

    async getBoxById(id: string): Promise<Box | undefined> {
        return this.boxRepository.getById(new ObjectId(id));
    }

    addBox(box: Box): void {
        if (!Box.validateDimensions(box)) {
            throw new Error("Error: Box dimensions are invalid");
        }
        this.boxRepository.add(box);
    }

    addBoxes(boxes: Box[]): void {
        boxes.forEach(b => {
            if (!Box.validateDimensions(b)) {
                throw new Error("Error: Box dimensions are invalid");
            }
        });
        this.boxRepository.addBulk(boxes);
    }

    updateBox(box: Box): void {
        if (!Box.validateDimensions(box)) {
            throw new Error("Error: Box dimensions are invalid");
        }
        this.boxRepository.update(box);
    }

    deleteBox(id: string): void {
        this.boxRepository.delete(new ObjectId(id));
    }

    async getAllWrappers(): Promise<Wrapper[]> {
        var originalWrappers: Wrapper[] = await this.wrapperRepository.getAll() as Wrapper[];
        var wrappers: Wrapper[] = [];
        var suppliers: Supplier[] = await this.supplierRepository.getAll() as Supplier[];

        // console.log(originalWrappers);

        originalWrappers.forEach(w => {
            console.log(w);
            const wid = Wrapper.retrieveId(w).toString() as string;
            const filteredSuppliers: Supplier[] = suppliers.filter(s => 
                s.wrappers.includes(wid)
            ) as Supplier[];

            // console.log(filteredSuppliers.at(0));
            if (filteredSuppliers.length){
                const sid = Supplier.retrieveId(filteredSuppliers.at(0)) as ObjectId;
                wrappers.push(Wrapper.toComplexObject(w, sid));
            } else {
                wrappers.push(w);
            }
        });

        return wrappers;
    }

    async getWrapperById(id: string): Promise<Wrapper | undefined> {
        const wrapper = await this.wrapperRepository.getById(new ObjectId(id));
        const suppliers = await this.supplierRepository.getAll();
        if (!wrapper) return undefined;
        return Wrapper.toNestedObject(
            wrapper,
            suppliers.filter(s => s.wrappers.includes(Wrapper.retrieveId(wrapper).toString()))[0]
        )
    }

    addWrapper(wrapper: Wrapper): void {
        if (!Wrapper.validateDimensions(wrapper)) {
            throw new Error("Error: Wrapper dimensions are invalid");
        }
        this.wrapperRepository.add(wrapper);
    }

    updateWrapper(wrapper: Wrapper): void {
        if (!Wrapper.validateDimensions(wrapper)) {
            throw new Error("Error: Wrapper dimensions are invalid");
        }
        this.wrapperRepository.update(wrapper);
    }

    deleteWrapper(id: string): void {
        this.wrapperRepository.delete(new ObjectId(id));
    }

    async getAllSuppliers(): Promise<Supplier[]> {
        var originalSuppliers = await this.supplierRepository.getAll();
        var suppliers: Supplier[] = [];
        
        originalSuppliers.forEach(s => {
            suppliers.push(Supplier.toSimpleObject(s));
        });
        return suppliers;
    }

    async getSupplierById(id: string): Promise< Supplier | undefined> {
        // var supplierCopy = Supplier.fromObject(this.supplierRepository.getById(id)?.toObject());
        var supplierCopy = deepCopy(await this.supplierRepository.getById(new ObjectId(id))) as Supplier;

        var wrapperIds: string[] = supplierCopy.wrappers;
        var wrappers: Promise<Wrapper | undefined>[] = [];
        var finalWrappers: Wrapper[] = [];

        wrapperIds.forEach(async w => {
            console.log("WrapperID: ", w);
            var wrapper = this.wrapperRepository.getById(new ObjectId(w));
            console.log("Correct Wrapper: ", wrapper);

            wrappers.push(wrapper);
            console.log("Current List of Wrappers: ", wrappers);
        });
        for (let i = 0; i < wrappers.length; i++) {
            const tempW = await wrappers[i];
            if (tempW) {
                finalWrappers.push(tempW);
            }
        }
        console.log("Final Wrapper list: ", finalWrappers);
        var supplier = Supplier.toSimpleObject(supplierCopy);
        supplier.wrappers = finalWrappers;

        return supplier;
    }

    addSupplier(supplier: Supplier): void {
        if (!Supplier.validatePhoneNumber(supplier)) {
            throw new Error("Error: Supplier phone number is invalid");
        }
        this.supplierRepository.add(supplier);
    }

    updateSupplier(supplier: Supplier): void {
        if (!Supplier.validatePhoneNumber(supplier)) {
            throw new Error("Error: Supplier phone number is invalid");
        }
        this.supplierRepository.update(supplier);
    }

    deleteSupplier(id: string): void {
        this.supplierRepository.delete(new ObjectId(id));
    }

    addWrapperToSupplier(supplierId: string, wrapperId: string): void {
        const supplier = this.supplierRepository.getById(new ObjectId(supplierId));
        if (supplier == undefined) {
            throw new Error("Supplier with ID" + supplierId + "does not exist");
        }

        const wrapper = this.wrapperRepository.getById(new ObjectId(wrapperId));
        if (wrapper == undefined) {
            throw new Error("Wrapper with ID" + wrapperId + "does not exist");
        }

        this.supplierRepository.addWrapper(new ObjectId(supplierId), wrapperId);
    }

    addCombo(combo: WrapperBoxCombo): void {
        this.comboRepository.add(combo);
    }

    async getAllCombos(): Promise<WrapperBoxCombo[]> {
        const combos = await this.comboRepository.getAll();
        const boxes = await this.boxRepository.getAll();
        const wrappers = await this.wrapperRepository.getAll();

        return combos;
    }

    async getComboById(id: string): Promise<WrapperBoxCombo | undefined> {
        var temp = await this.comboRepository.getById(new ObjectId(id));
        if (temp == undefined) {
            throw new Error("Combo with ID" + id + "does not exist");
        }

        var combo = temp as WrapperBoxCombo;

        combo = combo as WrapperBoxCombo;
        const boxes = await this.boxRepository.getAll();
        const wrappers = await this.wrapperRepository.getAll();
        const box = boxes.find(b => {
            return Box.retrieveId(b).equals(combo.boxId);
        });
        const wrapper = wrappers.find(w => {
            return Wrapper.retrieveId(w).equals(combo.wrapperId);
        });
        if (!box || !wrapper) {
            throw new Error("Box or wrapper not found");
        }
        return WrapperBoxCombo.toComplexObject(combo, wrapper, box);
        
    }

    updateCombo(combo: WrapperBoxCombo): void {
        this.comboRepository.update(combo);
    }

    deleteCombo(id: string): void {
        this.comboRepository.delete(new ObjectId(id));
    }

    async getBoxesLargerThan(size: number): Promise<Box[]> {
        const boxes = await this.boxRepository.getAll();
        return boxes.filter(b => Math.max(b.length, b.width, b.height) > size);
    }

    async getAverageWrapperLengths(): Promise<AverageWrapperLength[]> {
        const wrappers = await this.wrapperRepository.getAll() as Wrapper[];
        const suppliers = await this.supplierRepository.getAll() as Supplier[];

        return suppliers.map(s => {
            const supplierWrappers = wrappers.filter(w => s.wrappers.includes(Wrapper.retrieveId(w).toString()));
            const averageLength = supplierWrappers.reduce((acc, w) => acc + w.length, 0) / supplierWrappers.length;
            return new AverageWrapperLength(s, averageLength);
        }).sort((a, b) => b.averageLength - a.averageLength).sort((a, b) => {
            if (a.averageLength == null) {
                return 1;
            } else if (b.averageLength == null) {
                return -1;
            } else {
                return 0;
            }
        });
    }

}

export { Service, deepCopy };