import { AverageWrapperLength, Box, Supplier, Wrapper, WrapperBoxCombo } from "./entities";
import { PGBoxRepository, PGComboRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGWrapperRepository } from "./pgRepos";

class PGService {
    private boxRepository: PGBoxRepository;
    private wrapperRepository: PGWrapperRepository;
    private suppliedWrapperRepository: PGSuppliedWrapperRepository;
    private supplierRepository: PGSupplierRepository;
    private comboRepository: PGComboRepository;

    private defaultPageLength: number = 15;


    constructor() {
        this.boxRepository = new PGBoxRepository();
        this.wrapperRepository = new PGWrapperRepository();
        this.suppliedWrapperRepository = new PGSuppliedWrapperRepository();
        this.supplierRepository = new PGSupplierRepository();
        this.comboRepository = new PGComboRepository();
    }

    // Box Actions
    async getAllBoxes(): Promise<Box[]> {
        return this.boxRepository.getAll();
    }

    async getBoxById(id: number): Promise<Box> {
        return this.boxRepository.getById(id);
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

    deleteBox(id: number): void {
        this.boxRepository.delete(id);
    }

    // Wrapper Actions
    async getAllWrappers(): Promise<Wrapper[]> {
        const wrappers: Wrapper[] = await this.wrapperRepository.getAll();
        wrappers.forEach(async w => {
            const supplierId: number | undefined = await this.suppliedWrapperRepository.getSupplierId(w._id);
            if (supplierId) {
                w.supplierId = supplierId;
            }
        });

        return wrappers;
    }

    async getWrapperById(id: number): Promise<Wrapper> {
        const wrapper: Wrapper = await this.wrapperRepository.getById(id);
        const supplierId: number | undefined = await this.suppliedWrapperRepository.getSupplierId(id);
        if (supplierId) {
            wrapper.supplierId = supplierId;
        } else {
            wrapper.supplierId = null;
        }

        return wrapper;
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

    deleteWrapper(id: number): void {
        this.wrapperRepository.delete(id);
    }

    // Supplier Actions
    async getAllSuppliers(): Promise<Supplier[]> {
        return this.supplierRepository.getAll();
    }

    async getSupplierById(id: number): Promise<Supplier> {
        const supplier: Supplier = await this.supplierRepository.getById(id);
        const suppliedWrappers: Wrapper[] = await this.suppliedWrapperRepository.getSuppliedWrapperObjects(id);

        supplier.wrappers = suppliedWrappers;

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

    deleteSupplier(id: number): void {
        this.supplierRepository.delete(id);
    }

    addWrapperToSupplier(supplierId: number, wrapperId: number): void {
        const supplier = this.supplierRepository.getById(supplierId);
        if (supplier == undefined) {
            throw new Error("Supplier with ID" + supplierId + "does not exist");
        }

        const wrapper = this.wrapperRepository.getById(wrapperId);
        if (wrapper == undefined) {
            throw new Error("Wrapper with ID" + wrapperId + "does not exist");
        }

        this.suppliedWrapperRepository.add(supplierId, wrapperId);
    }

    addCombo(combo: WrapperBoxCombo): void {
        this.comboRepository.add(combo);
    }

    async getAllCombos(): Promise<WrapperBoxCombo[]> {
        return this.comboRepository.getAll();
    }

    async getComboById(id: number): Promise<WrapperBoxCombo> {
        const combo: WrapperBoxCombo = await this.comboRepository.getById(id);
        if (combo == undefined) {
            throw new Error("Combo with ID" + id + "does not exist");
        }

        if (combo.boxId == undefined || combo.wrapperId == undefined) {
            throw new Error("Combo with ID" + id + "is invalid");
        }

        const box: Box = await this.boxRepository.getById(combo.boxId);
        const wrapper: Wrapper = await this.wrapperRepository.getById(combo.wrapperId);

        return WrapperBoxCombo.toComplexObject(combo, wrapper, box);
    }

    updateCombo(combo: WrapperBoxCombo): void {
        this.comboRepository.update(combo);
    }

    deleteCombo(id: number): void {
        this.comboRepository.delete(id);
    }

    async getPageOfBoxes(page: number, pageLength: number = this.defaultPageLength): Promise<Promise<Box[]>> {
        return this.boxRepository.getPage(page, pageLength);
    }

    async getBoxPageCount(pageLength: number = this.defaultPageLength): Promise<number> {
        return Math.ceil(await this.boxRepository.getCount() / pageLength);
    }

    async getPageOfWrappers(page: number, pageLength: number = this.defaultPageLength): Promise<Wrapper[]> {
        const wrappers: Wrapper[] = await this.wrapperRepository.getPage(page, pageLength);
        wrappers.forEach(async w => {
            const supplierId: number | undefined = await this.suppliedWrapperRepository.getSupplierId(w._id);
            if (supplierId) {
                w.supplierId = supplierId;
            }
        });

        return wrappers;
    }

    async getWrapperPageCount(pageLength: number = this.defaultPageLength): Promise<number> {
        return Math.ceil(await this.wrapperRepository.getCount() / pageLength);
    }

    async getPageOfSuppliers(page: number, pageLength: number = this.defaultPageLength): Promise<Supplier[]> {
        const suppliers: Supplier[] = await this.supplierRepository.getPage(page, pageLength);
        suppliers.forEach(async s => {
            const suppliedWrappers: Wrapper[] = await this.suppliedWrapperRepository.getSuppliedWrapperObjects(s._id);
            s.wrappers = suppliedWrappers;
        });

        return suppliers;
    }

    async getSupplierPageCount(pageLength: number = this.defaultPageLength): Promise<number> {
        return Math.ceil(await this.supplierRepository.getCount() / pageLength);
    }

    async getPageOfCombos(page: number, pageLength: number = this.defaultPageLength): Promise<WrapperBoxCombo[]> {
        return this.comboRepository.getPage(page, pageLength);
    }

    async getComboPageCount(pageLength: number = this.defaultPageLength): Promise<number> {
        return Math.ceil(await this.comboRepository.getCount() / pageLength);
    }

    async getBoxesLargerThan(size: number, page: number, pageLength: number = this.defaultPageLength): Promise<Box[]> {
        // at least one dimension must be larger than size
        return this.boxRepository.getLargerThan(size, page, pageLength);
    }

    async getAverageWrapperLengths(page: number, pageLength: number = this.defaultPageLength): Promise<AverageWrapperLength[]> {
        return this.wrapperRepository.getAverageLengths(page, pageLength);
    }
}

export default PGService;