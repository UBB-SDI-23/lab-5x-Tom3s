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

    async add(box: Box, userId: number): Promise<void> {
        // INSERT INTO boxes (width, height, length, color, material) VALUES ($1, $2, $3, $4, $5)

        const query = 'INSERT INTO boxes (width, height, length, color, material) VALUES ($1, $2, $3, $4, $5) RETURNING _id';
        const values = [box.width, box.height, box.length, box.color, box.material];
        const result = await this.client.query(query, values);

        const boxId = result.rows[0]._id;
        const query2 = 'INSERT INTO box_owners (boxid, userid) VALUES ($1, $2)';
        const values2 = [boxId, userId];
        this.client.query(query2, values2);
    }

    async addBulk(boxes: Box[], userId: number): Promise<void> {
        var values: string = boxes
            .map(box => `(${box.width}, ${box.height}, ${box.length}, '${box.color}', '${box.material}')`).join(', ');

        const query = `INSERT INTO boxes (width, height, length, color, material) VALUES ${values} RETURNING _id`;
        const result = await this.client.query(query);

        const boxIds = result.rows.map(row => row._id);
        var values2: string = boxIds.map(boxId => `(${boxId}, ${userId})`).join(', ');
        const query2 = `INSERT INTO box_owners (boxid, userid) VALUES ${values2}`;
        this.client.query(query2);
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

    async deleteBulk(ids: number[]): Promise<void> {
        // DELETE FROM boxes WHERE _id IN ($1, $2, $3, ...)
        const queryPlaceholders = ids.map((id, index) => `$${index + 1}`).join(', ');
        const query = `DELETE FROM boxes WHERE _id IN (${queryPlaceholders})`;
        this.client.query(query, ids);
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

    async getOwnedBy(userId: number): Promise<number[]> {
        // SELECT boxid FROM box_owners WHERE userid = $1

        const result = await this.client.query('SELECT boxid FROM box_owners WHERE userid = $1', [userId]);
        return result.rows.map(row => row.boxid as number);
    }

    async getOwnerId(boxId: number): Promise<number> {
        // SELECT userid FROM box_owners WHERE boxid = $1

        const result = await this.client.query('SELECT userid FROM box_owners WHERE boxid = $1', [boxId]);
        return result.rows[0].userid as number;
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

    async add(wrapper: Wrapper, userId: number): Promise<void> {
        const query = 'INSERT INTO wrappers (length, width, color, complementaryColor, pattern) VALUES ($1, $2, $3, $4, $5) RETURNING _id';
        const values = [wrapper.length, wrapper.width, wrapper.color, wrapper.complementaryColor, wrapper.pattern];
        const result = await this.client.query(query, values);

        const wrapperId = result.rows[0]._id;
        const query2 = 'INSERT INTO wrapper_owners (wrapperid, userid) VALUES ($1, $2)';
        const values2 = [wrapperId, userId];
        this.client.query(query2, values2);
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

    async deleteBulk(ids: number[]): Promise<void> {
        // DELETE FROM wrappers WHERE _id IN ($1, $2, $3, ...)
        const queryPlaceholders = ids.map((id, index) => `$${index + 1}`).join(', ');
        const query = `DELETE FROM wrappers WHERE _id IN (${queryPlaceholders})`;
        this.client.query(query, ids);
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

    async getOwnedBy(userId: number): Promise<number[]> {
        // SELECT wrapperid FROM wrapper_owners WHERE userid = $1

        const result = await this.client.query('SELECT wrapperid FROM wrapper_owners WHERE userid = $1', [userId]);
        return result.rows.map(row => row.wrapperid as number);
    }

    async getOwnerId(wrapperId: number): Promise<number> {
        const result = await this.client.query('SELECT userid FROM wrapper_owners WHERE wrapperid = $1', [wrapperId]);
        return result.rows[0].userid as number;
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

    async add(supplier: Supplier, userId: number): Promise<void> {
        // INSERT INTO suppliers (name, address, phone, email) VALUES ($1, $2, $3, $4) RETURNING _id
        // INSERT INTO supplier_owners (supplierid, userid) VALUES ($1, $2)
        const query = 'INSERT INTO suppliers (name, address, phone, email) VALUES ($1, $2, $3, $4) RETURNING _id';
        const values = [supplier.name, supplier.address, supplier.phone, supplier.email];
        const result = await this.client.query(query, values);

        const supplierId = result.rows[0]._id;
        const query2 = 'INSERT INTO supplier_owners (supplierid, userid) VALUES ($1, $2)';
        const values2 = [supplierId, userId];
        this.client.query(query2, values2);
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

    async deleteBulk(ids: number[]): Promise<void> {
        // DELETE FROM suppliers WHERE _id IN ($1, $2, $3, ...)
        const queryPlaceholders = ids.map((id, index) => `$${index + 1}`).join(', ');
        const query = `DELETE FROM suppliers WHERE _id IN (${queryPlaceholders})`;
        this.client.query(query, ids);
    }

    async getCount(): Promise<number> {
        // SELECT COUNT(*) FROM suppliers
        const result = await this.client.query('SELECT COUNT(*) FROM suppliers');
        return result.rows[0].count;
    }

    async getOwnedBy(userId: number): Promise<number[]> {
        // SELECT supplierid FROM supplier_owners WHERE userid = $1
        const result = await this.client.query('SELECT supplierid FROM supplier_owners WHERE userid = $1', [userId]);
        return result.rows.map(row => row.supplierid as number);
    }

    async getOwnerId(supplierId: number): Promise<number> {
        const result = await this.client.query('SELECT userid FROM supplier_owners WHERE supplierId = $1', [supplierId]);
        return result.rows[0].userid as number;
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

    // add(combo: WrapperBoxCombo): void {
    //     this.client.query('INSERT INTO combos (wrapperId, boxId, name, price) VALUES ($1, $2, $3, $4)',
    //         [combo.wrapperid, combo.boxid, combo.name, combo.price], (err: Error, res: QueryResult) => {
    //             if (err) {
    //                 console.log(err.message);
    //                 throw new Error(err.message);
    //             } else {
    //                 console.log(res);
    //             }
    //         });
    // }

    async add(combo: WrapperBoxCombo, userId: number): Promise<void> {
        // INSERT INTO combos (wrapperId, boxId, name, price) VALUES ($1, $2, $3, $4) RETURNING _id
        // INSERT INTO combo_owners (comboid, userid) VALUES ($1, $2)
        const query = 'INSERT INTO combos (wrapperId, boxId, name, price) VALUES ($1, $2, $3, $4) RETURNING _id';
        const values = [combo.wrapperid, combo.boxid, combo.name, combo.price];
        const result = await this.client.query(query, values);

        const comboId = result.rows[0]._id;
        const query2 = 'INSERT INTO combo_owners (comboid, userid) VALUES ($1, $2)';
        const values2 = [comboId, userId];
        this.client.query(query2, values2);
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

    async deleteBulk(ids: number[]): Promise<void> {
        // DELETE FROM combos WHERE _id IN ($1, $2, $3, ...)
        const queryPlaceholders = ids.map((id, index) => `$${index + 1}`).join(', ');
        const query = `DELETE FROM combos WHERE _id IN (${queryPlaceholders})`;
        this.client.query(query, ids);
    }

    async getCount(): Promise<number> {
        const result = await this.client.query("SELECT value FROM cache_table WHERE key = 'combos_count';");
        return result.rows[0].value;
    }

    async getOwnedBy(userId: number): Promise<number[]> {
        const result = await this.client.query('SELECT comboid FROM combo_owners WHERE userid = $1', [userId]);
        return result.rows.map(row => row.comboid as number);
    }

    async getOwnerId(comboId: number): Promise<number> {
        const result = await this.client.query('SELECT userid FROM combo_owners WHERE comboId = $1', [comboId]);
        return result.rows[0].userid as number;
    }
}

export { PGBoxRepository, PGWrapperRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGComboRepository };