import { Client, QueryResult } from "pg";
import { AverageWrapperLength, Box, Supplier, Wrapper, WrapperBoxCombo } from "./entities";

class PGBoxRepository {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async getAll(): Promise<Box[]> {
        const result = await this.client.query('SELECT * FROM boxes');
        return result.rows as Box[];
    }

    async getPage(page: number, pageLength: number): Promise<Box[]> {
        // SELECT boxes.*, box_owners.userid
        // FROM boxes
        // LEFT JOIN box_owners
        // ON boxes.id = box_owners.boxid
        // ORDER BY _id
        // LIMIT $1
        // OFFSET $2;

        const offset = page * pageLength;
        const result = await this.client.query('SELECT boxes.*, box_owners.userid as ownerid FROM boxes LEFT JOIN box_owners ON boxes._id = box_owners.boxid ORDER BY _id LIMIT $1 OFFSET $2;', [pageLength, offset]);
        return result.rows as Box[];
    }

    async getById(id: number): Promise<Box> {
        const result = await this.client.query('SELECT boxes.*, box_owners.userid as ownerid FROM boxes LEFT JOIN box_owners ON boxes._id = box_owners.boxid WHERE _id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Box with id ${id} not found`);
        }
        return result.rows[0] as Box;
    }

    add(box: Box): void {
        // INSERT INTO boxes (width, height, length, color, material) VALUES ($1, $2, $3, $4, $5)
        this.client.query('INSERT INTO boxes (width, height, length, color, material) VALUES ($1, $2, $3, $4, $5)', [box.width, box.height, box.length, box.color, box.material], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    addBulk(boxes: Box[]): void {
        var values: string = boxes
            .map(box => `(${box.width}, ${box.height}, ${box.length}, '${box.color}', '${box.material}')`).join(', ');

        this.client.query(`INSERT INTO boxes (width, height, length, color, material) VALUES ${values}`, (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    update(box: Box): void {
        this.client.query('UPDATE boxes SET width = $1, height = $2, length = $3, color = $4, material = $5 WHERE _id = $6', [box.width, box.height, box.length, box.color, box.material, box._id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    delete(id: number): void {
        this.client.query('DELETE FROM boxes WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    async getCount(): Promise<number> {
        // SELECT COUNT(*) FROM boxes
        const result = await this.client.query('SELECT COUNT(*) FROM boxes');
        return parseInt(result.rows[0].count);
    }

    async getLargerThan(size: number, page: number, pageLength: number): Promise<Box[]> {
        // SELECT * FROM boxes
        // WHERE width > $size OR height > $size OR length > $size
        // ORDER BY _id
        // LIMIT $pageLength
        // OFFSET $page * $pageLength

        const offset = page * pageLength;
        const result = await this.client.query('SELECT boxes.*, box_owners.userid as ownerid FROM boxes LEFT JOIN box_owners ON boxes._id = box_owners.boxid WHERE width > $1 OR height > $1 OR length > $1 ORDER BY _id LIMIT $2 OFFSET $3', [size, pageLength, offset]);
        return result.rows as Box[];
    }
}

class PGWrapperRepository {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async getAll(): Promise<Wrapper[]> {
        const result = await this.client.query('SELECT * FROM wrappers');
        return result.rows as Wrapper[];
    }

    async getPage(page: number, pageLength: number): Promise<Wrapper[]> {
        const offset = page * pageLength;
        const result = await this.client.query('SELECT wrappers.*, wrapper_owners.userid as ownerid FROM wrappers LEFT JOIN wrapper_owners ON wrappers._id = wrapper_owners.wrapperid ORDER BY _id LIMIT $1 OFFSET $2;', [pageLength, offset]);
        return result.rows as Wrapper[];
    }

    async getById(id: number): Promise<Wrapper> {
        const result = await this.client.query('SELECT wrappers.*, wrapper_owners.userid as ownerid FROM wrappers LEFT JOIN wrapper_owners ON wrappers._id = wrapper_owners.wrapperid WHERE _id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Wrapper with id ${id} not found`);
        }
        return result.rows[0] as Wrapper;
    }

    add(wrapper: Wrapper): void {
        this.client.query('INSERT INTO wrappers (length, width, color, complementaryColor, pattern) VALUES ($1, $2, $3, $4, $5)',
            [wrapper.length, wrapper.width, wrapper.color, wrapper.complementaryColor, wrapper.pattern], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    update(wrapper: Wrapper): void {
        this.client.query('UPDATE wrappers SET length = $1, width = $2, color = $3, complementaryColor = $4, pattern = $5 WHERE _id = $6',
            [wrapper.length, wrapper.width, wrapper.color, wrapper.complementaryColor, wrapper.pattern, wrapper._id], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    delete(id: number): void {
        this.client.query('DELETE FROM wrappers WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    async getCount(): Promise<number> {
        // SELECT COUNT(*) FROM wrappers
        const result = await this.client.query('SELECT COUNT(*) FROM wrappers');
        return parseInt(result.rows[0].count);
    }

    async getAverageLengths(page: number, pageLength: number): Promise<AverageWrapperLength[]> {
        /*
        AverageWrapperLength: 
            {
                supplier: {
                    _id: number,
                    name: string,   
                    address: string,
                    phone: string,
                    email: string,
                },
                averageLength: number
            }
        */
        var suppliers: Supplier[] = [];
        // var averageLengths: AverageWrapperLength[] = [];
        const offset = page * pageLength;
        const result = await this.client.query('SELECT * FROM suppliers ORDER BY _id LIMIT $1 OFFSET $2', [pageLength, offset]);
        suppliers = result.rows as Supplier[];

        var averageLengths: Promise<AverageWrapperLength>[] = suppliers.map(async (supplier: Supplier) => {
            // SELECT suppliedWrappers.supplierId, AVG(wrappers.length) AS averageLength
            // FROM suppliedWrappers
            // JOIN wrappers ON suppliedWrappers.wrapperId = wrappers._id
            // WHERE suppliedWrappers.supplierId = <your_supplier_id>
            // GROUP BY suppliedWrappers.supplierId;
            var averageLength: number | null = null;
            const tempResult = await this.client.query('SELECT suppliedWrappers.supplierId, AVG(wrappers.length) AS averageLength FROM suppliedWrappers JOIN wrappers ON suppliedWrappers.wrapperId = wrappers._id WHERE suppliedWrappers.supplierId = $1 GROUP BY suppliedWrappers.supplierId', [supplier._id]);
            console.log(tempResult.rows);
            if (tempResult.rows.length > 0) {
                averageLength = tempResult.rows[0].averagelength;
            }
            return new AverageWrapperLength(supplier, averageLength);
        });


        return await Promise.all(averageLengths);
    }

}

class PGSuppliedWrapperRepository {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async getSupplierId(wrapperId: number): Promise<number | undefined> {
        // SELECT supplierId FROM suppliedWrappers WHERE wrapperId = $1
        const result = await this.client.query('SELECT supplierId FROM suppliedWrappers WHERE wrapperId = $1', [wrapperId]);
        if (result.rows.length === 0) {
            return undefined;
        }
        return result.rows[0].supplierid;
    }

    async getSuppliedWrapperObjects(supplierId: number): Promise<Wrapper[]> {
        // SELECT w.* 
        // FROM wrappers w 
        // JOIN suppliedWrappers sw ON w._id = sw.wrapperId 
        // WHERE sw.supplierId = 1
        const result = await this.client.query('SELECT w.* FROM wrappers w JOIN suppliedWrappers sw ON w._id = sw.wrapperId WHERE sw.supplierId = $1', [supplierId]);
        return result.rows as Wrapper[];
    }
    
    async getSuppliedWrapperIds(supplierId: number): Promise<number[]> {
        const result = await this.client.query('SELECT wrapperId FROM suppliedWrappers WHERE supplierId = $1', [supplierId]);
        return result.rows as number[];
    }

    add(supplierId: number, wrapperId: number): void {
        this.client.query('INSERT INTO suppliedWrappers (supplierId, wrapperId) VALUES ($1, $2)', [supplierId, wrapperId], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }
}

class PGSupplierRepository {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async getAll(): Promise<Supplier[]> {
        // SELECT * FROM suppliers
        const result = await this.client.query('SELECT * FROM suppliers');
        return result.rows as Supplier[];
    }

    async getPage(pageSize: number, pageLength: number): Promise<Supplier[]> {
        const offset = pageSize * pageLength;
        const result = await this.client.query('SELECT suppliers.*, supplier_owners.userid as ownerid FROM suppliers LEFT JOIN supplier_owners ON suppliers._id = supplier_owners.supplierid ORDER BY _id LIMIT $1 OFFSET $2;', [pageLength, offset]);
        return result.rows as Supplier[];
    }

    async getById(id: number): Promise<Supplier> {
        const result = await this.client.query('SELECT suppliers.*, supplier_owners.userid as ownerid FROM suppliers LEFT JOIN supplier_owners ON suppliers._id = supplier_owners.supplierid WHERE _id = $1', [id]);      
        if (result.rows.length === 0) {
            throw new Error(`Supplier with id ${id} not found`);
        }
        return result.rows[0] as Supplier;
    }

    add(supplier: Supplier): void {
        this.client.query('INSERT INTO suppliers (name, address, phone, email) VALUES ($1, $2, $3, $4)',
            [supplier.name, supplier.address, supplier.phone, supplier.email], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    update(supplier: Supplier): void {
        this.client.query('UPDATE suppliers SET name = $1, address = $2, phone = $3, email = $4 WHERE _id = $5',
            [supplier.name, supplier.address, supplier.phone, supplier.email, supplier._id], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    delete(id: number): void {
        this.client.query('DELETE FROM suppliers WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    async getCount(): Promise<number> {
        // SELECT COUNT(*) FROM suppliers
        const result = await this.client.query('SELECT COUNT(*) FROM suppliers');
        return result.rows[0].count;
    }
}

class PGComboRepository {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async getAll(): Promise<WrapperBoxCombo[]> {
        const result = await this.client.query('SELECT * FROM combos');
        return result.rows as WrapperBoxCombo[];
    }

    async getPage(pageSize: number, pageLength: number): Promise<WrapperBoxCombo[]> {
        const offset = pageSize * pageLength;
        const result = await this.client.query('SELECT combos.*, combo_owners.userid as ownerid FROM combos LEFT JOIN combo_owners ON combos._id = combo_owners.comboid ORDER BY _id LIMIT $1 OFFSET $2;', [pageLength, offset]);
        return result.rows as WrapperBoxCombo[];
    }

    add(combo: WrapperBoxCombo): void {
        this.client.query('INSERT INTO combos (wrapperId, boxId, name, price) VALUES ($1, $2, $3, $4)',
            [combo.wrapperid, combo.boxid, combo.name, combo.price], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    async getById(id: number): Promise<WrapperBoxCombo> {
        const result = await this.client.query('SELECT combos.*, combo_owners.userid as ownerid FROM combos LEFT JOIN combo_owners ON combos._id = combo_owners.comboid WHERE _id = $1', [id]);
        if (result.rows.length === 0) {
            throw new Error(`Combo with id ${id} not found`);
        }
        return result.rows[0] as WrapperBoxCombo;
    }

    update(combo: WrapperBoxCombo): void {
        this.client.query('UPDATE combos SET wrapperId = $1, boxId = $2, name = $3, price = $4 WHERE _id = $5',
            [combo.wrapperid, combo.boxid, combo.name, combo.price, combo._id], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    delete(id: number): void {
        this.client.query('DELETE FROM combos WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                console.log(res);
            }
        });
    }

    async getCount(): Promise<number> {
        const result = await this.client.query("SELECT value FROM cache_table WHERE key = 'combos_count';");
        return result.rows[0].value;
    }
}

export { PGBoxRepository, PGWrapperRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGComboRepository };