// import { sign } from "jsonwebtoken";
import { AverageWrapperLength, Box, Supplier, Wrapper, WrapperBoxCombo } from "./entities";
import { PGBoxRepository, PGComboRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGWrapperRepository } from "./pgRepos";
import AuthRepo from "./userRepos";

class PGService {
    private boxRepository: PGBoxRepository;
    private wrapperRepository: PGWrapperRepository;
    private suppliedWrapperRepository: PGSuppliedWrapperRepository;
    private supplierRepository: PGSupplierRepository;
    private comboRepository: PGComboRepository;
    private authRepo: AuthRepo;

    private defaultPageLength: number = 15;


    constructor() {
        this.boxRepository = new PGBoxRepository();
        this.wrapperRepository = new PGWrapperRepository();
        this.suppliedWrapperRepository = new PGSuppliedWrapperRepository();
        this.supplierRepository = new PGSupplierRepository();
        this.comboRepository = new PGComboRepository();
        this.authRepo = new AuthRepo();
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

        if (combo.boxid == undefined || combo.wrapperid == undefined) {
            throw new Error("Combo with ID" + id + "is invalid");
        }

        const box: Box = await this.boxRepository.getById(combo.boxid);
        const wrapper: Wrapper = await this.wrapperRepository.getById(combo.wrapperid);

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
        // suppliers.forEach(async s => {
        //     const suppliedWrappers: number[] = await this.suppliedWrapperRepository.getSuppliedWrapperIds(s._id);
        //     s.wrappers = suppliedWrappers;
        // });

        const suppliersWithWrappers: Promise<Supplier>[] = suppliers.map(async s => {
            const suppliedWrappers: Wrapper[] = await this.suppliedWrapperRepository.getSuppliedWrapperObjects(s._id);
            s.wrappers = suppliedWrappers.map(w => w._id);
            return s;
        });

        return Promise.all(suppliersWithWrappers);
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

    private isStrongPassword(password: string): boolean {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    }

    async getRegistrationToken(username: string, password: string): Promise<string> {

        if (await this.authRepo.checkIfUserExists(username)) {
            throw new Error("Username taken");
        }

        if (!this.isStrongPassword(password)) {
            throw new Error("Password is not strong enough");
        }

        const jwt = require('jsonwebtoken')

        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const data = {
            "username": username,
            "password": password,
            "date": Date.now()
        }

        const token = jwt.sign(data, jwtSecretKey);

        return token;
    }

    async confirmRegistration(providedToken: string): Promise<boolean> {
        const jwt = require('jsonwebtoken')

        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        // try {
        const decoded = jwt.verify(providedToken, jwtSecretKey);

        if (!decoded) {
            throw new Error("Invalid Token");
        }

        const tokenDate = new Date(decoded.date);
        const currentDate = new Date();

        const timeDifference = currentDate.getTime() - tokenDate.getTime();
        const timeDifferenceInMinutes = timeDifference / (1000 * 60);

        if (timeDifferenceInMinutes > 10) {
            throw new Error("Token expired");
        }

        const username = decoded.username;
        const password = decoded.password;

        if (await this.authRepo.checkIfUserExists(username)) {
            throw new Error("Token already used");
        }

        // hash password with sha256
        const { createHash } = require('crypto');

        const passwordHash = createHash('sha256').update(password).digest('hex');

        this.authRepo.registerUser(username, passwordHash);

        return true;

        // } catch (error) {
        //     console.log(error);
        //     return false;
        // }
    }
}

export default PGService;