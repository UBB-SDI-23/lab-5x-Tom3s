// import { sign } from "jsonwebtoken";
import { AverageWrapperLength, Box, Supplier, Wrapper, WrapperBoxCombo } from "./entities";
import { PGBoxRepository, PGComboRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGWrapperRepository } from "./pgRepos";
import { SessionDetails, UserDetails } from "./userEntities";
import { AuthRepo,  UserRepository } from "./userRepos";

class PGService {
    private boxRepository: PGBoxRepository;
    private wrapperRepository: PGWrapperRepository;
    private suppliedWrapperRepository: PGSuppliedWrapperRepository;
    private supplierRepository: PGSupplierRepository;
    private comboRepository: PGComboRepository;
    private authRepository: AuthRepo;
    private userRepository: UserRepository;

    private defaultPageLength: number = 15;


    constructor() {
        this.boxRepository = new PGBoxRepository();
        this.wrapperRepository = new PGWrapperRepository();
        this.suppliedWrapperRepository = new PGSuppliedWrapperRepository();
        this.supplierRepository = new PGSupplierRepository();
        this.comboRepository = new PGComboRepository();
        this.authRepository = new AuthRepo();
        this.userRepository = new UserRepository();
    }

    // Box Actions
    async getAllBoxes(): Promise<Box[]> {
        return this.boxRepository.getAll();
    }

    async getBoxById(id: number): Promise<Box> {
        return this.boxRepository.getById(id);
    }

    addBox(box: Box, token: string): void {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add a box.");
        }

        Box.checkEmpty(box);
        Box.validateDimensions(box);

        this.boxRepository.add(box, sessionDetails.userid);
    }

    addBoxes(boxes: Box[], token: string): void {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add boxes.");
        }
        boxes.forEach(b => {
            Box.checkEmpty(b);
            Box.validateDimensions(b);
        });

        this.boxRepository.addBulk(boxes, sessionDetails.userid);
    }

    async updateBox(box: Box, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to update a box.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.boxRepository.getOwnerId(box._id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a box can update it.");
            }
        }

        Box.checkEmpty(box);
        Box.validateDimensions(box);

        this.boxRepository.update(box);
    }

    async deleteBox(id: number, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to delete a box.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.boxRepository.getOwnerId(id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a box can delete it.");
            }
        }

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

    addWrapper(wrapper: Wrapper, token: string): void {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add a wrapper.");
        }

        Wrapper.checkEmpty(wrapper);
        Wrapper.validateDimensions(wrapper);

        this.wrapperRepository.add(wrapper, sessionDetails.userid);
    }

    async updateWrapper(wrapper: Wrapper, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to update a wrapper.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.wrapperRepository.getOwnerId(wrapper._id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a wrapper can update it.");
            }
        }
        
        Wrapper.checkEmpty(wrapper);
        Wrapper.validateDimensions(wrapper);

        this.wrapperRepository.update(wrapper);
    }

    async deleteWrapper(id: number, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to delete a wrapper.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.wrapperRepository.getOwnerId(id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a wrapper can delete it.");
            }
        }
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

    addSupplier(supplier: Supplier, token: string): void {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add a supplier.");
        }

        Supplier.checkEmpty(supplier);
        Supplier.validatePhoneNumber(supplier);
        Supplier.validateEmail(supplier);

        this.supplierRepository.add(supplier, sessionDetails.userid);
    }

    async updateSupplier(supplier: Supplier, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to update a supplier.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.supplierRepository.getOwnerId(supplier._id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a supplier can update it.");
            }
        }

        Supplier.checkEmpty(supplier);
        Supplier.validatePhoneNumber(supplier);
        Supplier.validateEmail(supplier);

        this.supplierRepository.update(supplier);
    }

    // deleteSupplier(id: number): void {
    //     this.supplierRepository.delete(id);
    // }

    async deleteSupplier(id: number, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to delete a supplier.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.supplierRepository.getOwnerId(id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a supplier can delete it.");
            }
        }
        this.supplierRepository.delete(id);
    }

    async addWrapperToSupplier(supplierId: number, wrapperId: number, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add a wrapper to a supplier.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.supplierRepository.getOwnerId(supplierId);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a supplier can add a wrapper to it.");
            }
        }
        
        // Check if supplier and wrapper exist
        await this.supplierRepository.getById(supplierId);
        await this.wrapperRepository.getById(wrapperId);

        this.suppliedWrapperRepository.add(supplierId, wrapperId);
    }

    // addCombo(combo: WrapperBoxCombo): void {
    //     this.comboRepository.add(combo);
    // }

    async addCombo(combo: WrapperBoxCombo, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to add a combo.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.comboRepository.getOwnerId(combo._id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a combo can add it.");
            }
        }

        WrapperBoxCombo.checkEmpty(combo);
        WrapperBoxCombo.validatePrice(combo);

        await this.boxRepository.getById(combo.boxid as number);
        await this.wrapperRepository.getById(combo.wrapperid as number);

        this.comboRepository.add(combo, sessionDetails.userid);
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

    async updateCombo(combo: WrapperBoxCombo, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to update a combo.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.comboRepository.getOwnerId(combo._id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a combo can update it.");
            }
        }

        WrapperBoxCombo.checkEmpty(combo);
        WrapperBoxCombo.validatePrice(combo);

        await this.boxRepository.getById(combo.boxid as number);
        await this.wrapperRepository.getById(combo.wrapperid as number);

        this.comboRepository.update(combo);
    }

    // deleteCombo(id: number): void {
    //     this.comboRepository.delete(id);
    // }

    async deleteCombo(id: number, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (!sessionDetails) {
            throw new Error("Error: Invalid token! Please log in or register to delete a combo.");
        }

        if (sessionDetails.role === "user") {
            const ownerId = await this.comboRepository.getOwnerId(id);

            if (ownerId !== sessionDetails.userid) {
                throw new Error("Error: Only the owner of a combo can delete it.");
            }
        }

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

        if (await this.authRepository.checkIfUserExists(username)) {
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

        if (await this.authRepository.checkIfUserExists(username)) {
            throw new Error("Token already used");
        }

        // hash password with sha256
        const { createHash } = require('crypto');

        const passwordHash = createHash('sha256').update(password).digest('hex');

        this.authRepository.registerUser(username, passwordHash);

        return true;

        // } catch (error) {
        //     console.log(error);
        //     return false;
        // }
    }

    async login(username: string, password: string): Promise<string> {
        const userId = await this.authRepository.checkIfUserExists(username);
        if (userId === -1) {
            throw new Error("Username does not exist");
        }

        const { createHash } = require('crypto');

        const passwordHash = createHash('sha256').update(password).digest('hex');

        const role = await this.authRepository.verifyUser(username, passwordHash);

        if (role == "") {
            throw new Error("Password is incorrect");
        }


        const jwt = require('jsonwebtoken')

        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const data: SessionDetails = {
            "userid": userId,
            "username": username,
            "logindate": Date.now(),
            "role": role
        };

        const token = jwt.sign(data, jwtSecretKey);

        return token;
    }

    async getUserById(id: number, lists: boolean): Promise<UserDetails> {
        if (!(await this.userRepository.checkIfUserExists(id))) {
            throw new Error("User does not exist");
        }

        const user: UserDetails = await this.userRepository.getUserById(id);

        if (!lists) {
            return user;
        }

        user.boxes = await this.boxRepository.getOwnedBy(id);
        user.wrappers = await this.wrapperRepository.getOwnedBy(id);
        user.suppliers = await this.supplierRepository.getOwnedBy(id);
        user.combos = await this.comboRepository.getOwnedBy(id);

        return user;
    }

    async getUserName(id: number): Promise<any> {
        if (!(await this.userRepository.checkIfUserExists(id))) {
            throw new Error("User does not exist");
        }

        const username: string = await this.userRepository.getUsernameById(id);

        return {
            "username": username,
            "id": id
        }
    }

    private verifyToken(token: string): SessionDetails | null {
        const jwt = require('jsonwebtoken')

        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        // try {
        //     var decoded = jwt.verify(token, jwtSecretKey) as SessionDetails;
            
        //     // check if logindate is older than 1 hour
        //     const tokenDate = new Date(decoded.logindate);
        //     const currentDate = new Date();
        //     if (currentDate.getTime() - tokenDate.getTime() > 3600000) {
        //         return null;
        //     }

        //     return decoded;
        // } catch (error) {
        //     return null;
        // }

        var decoded: SessionDetails | null = null;

        try {
            decoded = jwt.verify(token, jwtSecretKey) as SessionDetails;
        } catch (error) {
            return null;
        }

        // check if logindate is older than 1 hour
        const tokenDate = new Date(decoded.logindate);
        const currentDate = new Date();
        if (currentDate.getTime() - tokenDate.getTime() > 3600000) {
            throw new Error("Login session expired");
        }

        return decoded;
    }

    async changeUserRole(userid: number, newRole: string, token: string): Promise<void> {
        const sessionDetails = this.verifyToken(token);

        if (sessionDetails == null) {
            throw new Error("Invalid token");
        }

        if (sessionDetails.role != "admin") {
            throw new Error("Not authorized");
        }

        if (!(await this.userRepository.checkIfUserExists(userid))) {
            throw new Error("User does not exist");
        }

        this.authRepository.setUserRole(userid, newRole);
    }
}

export default PGService;