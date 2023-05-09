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
    getAllBoxes(): Box[] {
        return this.boxRepository.getAll();
    }

    getBoxById(id: number): Box {
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
    getAllWrappers(): Wrapper[] {
        const wrappers: Wrapper[] = this.wrapperRepository.getAll();
        wrappers.forEach(w => {
            const supplierId: number = this.suppliedWrapperRepository.getSupplierId(w._id);
            if (supplierId) {
                w.supplierId = supplierId;
            }
        });

        return wrappers;
    }

    getWrapperById(id: number): Wrapper {
        const wrapper: Wrapper = this.wrapperRepository.getById(id);
        const supplierId: number = this.suppliedWrapperRepository.getSupplierId(id);
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
    getAllSuppliers(): Supplier[] {
        return this.supplierRepository.getAll();
    }

    getSupplierById(id: number): Supplier {
        const supplier: Supplier = this.supplierRepository.getById(id);
        const suppliedWrappers: Wrapper[] = this.suppliedWrapperRepository.getSuppliedWrapperObjects(id);

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

    getAllCombos(): WrapperBoxCombo[] {
        return this.comboRepository.getAll();
    }

    getComboById(id: number): WrapperBoxCombo {
        const combo: WrapperBoxCombo = this.comboRepository.getById(id);
        if (combo == undefined) {
            throw new Error("Combo with ID" + id + "does not exist");
        }

        if (combo.boxId == undefined || combo.wrapperId == undefined) {
            throw new Error("Combo with ID" + id + "is invalid");
        }

        const box: Box = this.boxRepository.getById(combo.boxId);
        const wrapper: Wrapper = this.wrapperRepository.getById(combo.wrapperId);

        return WrapperBoxCombo.toComplexObject(combo, wrapper, box);
    }

    updateCombo(combo: WrapperBoxCombo): void {
        this.comboRepository.update(combo);
    }

    deleteCombo(id: number): void {
        this.comboRepository.delete(id);
    }

    getPageOfBoxes(page: number, pageLength: number = this.defaultPageLength): Box[] {
        return this.boxRepository.getPage(page, pageLength);
    }

    getBoxPageCount(pageLength: number = this.defaultPageLength): number {
        return Math.ceil(this.boxRepository.getCount() / pageLength);
    }

    getPageOfWrappers(page: number, pageLength: number = this.defaultPageLength): Wrapper[] {
        const wrappers: Wrapper[] = this.wrapperRepository.getPage(page, pageLength);
        wrappers.forEach(w => {
            const supplierId: number = this.suppliedWrapperRepository.getSupplierId(w._id);
            if (supplierId) {
                w.supplierId = supplierId;
            }
        });

        return wrappers;
    }

    getWrapperPageCount(pageLength: number = this.defaultPageLength): number {
        return Math.ceil(this.wrapperRepository.getCount() / pageLength);
    }

    getPageOfSuppliers(page: number, pageLength: number = this.defaultPageLength): Supplier[] {
        const suppliers: Supplier[] = this.supplierRepository.getPage(page, pageLength);
        suppliers.forEach(s => {
            const suppliedWrappers: Wrapper[] = this.suppliedWrapperRepository.getSuppliedWrapperObjects(s._id);
            s.wrappers = suppliedWrappers;
        });

        return suppliers;
    }

    getSupplierPageCount(pageLength: number = this.defaultPageLength): number {
        return Math.ceil(this.supplierRepository.getCount() / pageLength);
    }

    getPageOfCombos(page: number, pageLength: number = this.defaultPageLength): WrapperBoxCombo[] {
        return this.comboRepository.getPage(page, pageLength);
    }

    getComboPageCount(pageLength: number = this.defaultPageLength): number {
        return Math.ceil(this.comboRepository.getCount() / pageLength);
    }

    getBoxesLargerThan(size: number, page: number, pageLength: number = this.defaultPageLength): Box[] {
        // at least one dimension must be larger than size
        return this.boxRepository.getLargerThan(size, page, pageLength);
    }

    getAverageWrapperLengths(page: number, pageLength: number = this.defaultPageLength): AverageWrapperLength[] {
        return this.wrapperRepository.getAverageLengths(page, pageLength);
    }
}

export default PGService;