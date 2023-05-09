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

    getAll(): Box[] {
        var boxes: Box[] = [];
        this.client.query('SELECT * FROM boxes', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                boxes = res.rows as Box[];
            }
        });
        return boxes;
    }

    getPage(page: number, pageSize: number): Box[] {
        var boxes: Box[] = [];
        const offset = page * pageSize;
        this.client.query('SELECT * FROM boxes ORDER BY _id LIMIT $1 OFFSET $2', [pageSize, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                boxes = res.rows as Box[];
            }
        });
        return boxes;
    }

    getById(id: number): Box {
        // var box: Box;
        this.client.query('SELECT * FROM boxes WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                if (res.rowCount <= 0) {
                    throw new Error("Error: Box not found");
                }
                return res.rows[0] as Box;
            }
        });
        throw new Error("Unknown error occurred");
    }

    add(box: Box): void {
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

    getCount(): number {
        var count: number = 0;
        this.client.query('SELECT COUNT(*) FROM boxes', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                count = res.rows[0].count;
            }
        });
        return count;
    }

    getLargerThan(size: number, page: number, pageLength: number): Box[] {
        // SELECT * FROM boxes 
        // WHERE width > $size OR height > $size OR length > $size

        // SELECT * FROM boxes
        // WHERE width > $size OR height > $size OR length > $size
        // ORDER BY _id
        // LIMIT $pageLength
        // OFFSET $page * $pageLength

        var boxes: Box[] = [];
        const offset = page * pageLength;
        this.client.query('SELECT * FROM boxes WHERE width > $1 OR height > $1 OR length > $1 ORDER BY _id LIMIT $2 OFFSET $3', [size, pageLength, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                boxes = res.rows as Box[];
            }
        });
        return boxes;
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

    getAll(): Wrapper[] {
        var wrappers: Wrapper[] = [];
        this.client.query('SELECT * FROM wrappers', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                wrappers = res.rows as Wrapper[];
            }
        });
        return wrappers;
    }

    getPage(page: number, pageSize: number): Wrapper[] {
        var wrappers: Wrapper[] = [];
        const offset = page * pageSize;
        this.client.query('SELECT * FROM wrappers ORDER BY _id LIMIT $1 OFFSET $2', [pageSize, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                wrappers = res.rows as Wrapper[];
            }
        });
        return wrappers;
    }

    getById(id: number): Wrapper {
        this.client.query('SELECT * FROM wrappers WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                if (res.rowCount <= 0) {
                    throw new Error("Error: Wrapper not found");
                }
                return res.rows[0] as Wrapper;
            }
        });
        throw new Error("Unknown error occurred");
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

    getCount(): number {
        var count: number = 0;
        this.client.query('SELECT COUNT(*) FROM wrappers', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                count = res.rows[0].count;
            }
        });
        return count;
    }

    getAverageLengths(page: number, pageLength: number): AverageWrapperLength[] {
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
        var averageLengths: AverageWrapperLength[] = [];
        const offset = page * pageLength;
        this.client.query('SELECT * FROM suppliers ORDER BY _id LIMIT $1 OFFSET $2', [pageLength, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                suppliers = res.rows as Supplier[];
            }
        });

        suppliers.forEach((supplier: Supplier) => {
            // SELECT suppliedWrappers.supplierId, AVG(wrappers.length) AS averageLength
            // FROM suppliedWrappers
            // JOIN wrappers ON suppliedWrappers.wrapperId = wrappers._id
            // WHERE suppliedWrappers.supplierId = <your_supplier_id>
            // GROUP BY suppliedWrappers.supplierId;
            var averageLength: number | null = null;
            this.client.query('SELECT suppliedWrappers.supplierId, AVG(wrappers.length) AS averageLength FROM suppliedWrappers JOIN wrappers ON suppliedWrappers.wrapperId = wrappers._id WHERE suppliedWrappers.supplierId = $1 GROUP BY suppliedWrappers.supplierId', [supplier._id], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                } else {
                    averageLength = res.rows[0].averageLength;
                }
            });
            averageLengths.push(new AverageWrapperLength(supplier, averageLength));
        });

        return averageLengths;
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

    getSupplierId(wrapperId: number): number {
        this.client.query('SELECT supplierId FROM suppliedWrappers WHERE wrapperId = $1', [wrapperId], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                if (res.rowCount <= 0) {
                    throw new Error("Error: Wrapper not found");
                }
                return res.rows[0].supplierId as number;
            }
        });
        throw new Error("Unknown error occurred");
    }

    getSuppliedWrapperObjects(supplierId: number): Wrapper[] {
        // SELECT w.* 
        // FROM wrappers w 
        // JOIN suppliedWrappers sw ON w._id = sw.wrapperId 
        // WHERE sw.supplierId = 1
        this.client.query('SELECT w.* FROM wrappers w JOIN suppliedWrappers sw ON w._id = sw.wrapperId WHERE sw.supplierId = $1', [supplierId], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                return res.rows as Wrapper[];
            }
        });
        throw new Error("Unknown error occurred");
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

    getAll(): Supplier[] {
        var suppliers: Supplier[] = [];
        this.client.query('SELECT * FROM suppliers', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                suppliers = res.rows as Supplier[];
            }
        });
        return suppliers;
    }

    getPage(pageSize: number, offset: number): Supplier[] {
        var suppliers: Supplier[] = [];
        this.client.query('SELECT * FROM suppliers LIMIT $1 OFFSET $2', [pageSize, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                suppliers = res.rows as Supplier[];
            }
        });
        return suppliers;
    }

    getById(id: number): Supplier {
        this.client.query('SELECT * FROM suppliers WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                if (res.rowCount <= 0) {
                    throw new Error("Error: Supplier not found");
                }
                return res.rows[0] as Supplier;
            }
        });
        throw new Error("Unknown error occurred");
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

    getCount(): number {
        var count: number = 0;
        this.client.query('SELECT COUNT(*) FROM suppliers', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                count = res.rows[0].count;
            }
        });
        return count;
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

    getAll(): WrapperBoxCombo[] {
        var combos: WrapperBoxCombo[] = [];
        this.client.query('SELECT * FROM combos', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                combos = res.rows as WrapperBoxCombo[];
            }
        });
        return combos;
    }

    getPage(pageSize: number, offset: number): WrapperBoxCombo[] {
        var combos: WrapperBoxCombo[] = [];
        this.client.query('SELECT * FROM combos LIMIT $1 OFFSET $2', [pageSize, offset], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                combos = res.rows as WrapperBoxCombo[];
            }
        });
        return combos;
    }

    add(combo: WrapperBoxCombo): void {
        this.client.query('INSERT INTO combos (wrapperId, boxId, name, price) VALUES ($1, $2, $3, $4)',
            [combo.wrapperId, combo.boxId, combo.name, combo.price], (err: Error, res: QueryResult) => {
                if (err) {
                    console.log(err.message);
                    throw new Error(err.message);
                } else {
                    console.log(res);
                }
            });
    }

    getById(id: number): WrapperBoxCombo {
        this.client.query('SELECT * FROM combos WHERE _id = $1', [id], (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
                throw new Error(err.message);
            } else {
                if (res.rowCount <= 0) {
                    throw new Error("Error: Combo not found");
                }
                return res.rows[0] as WrapperBoxCombo;
            }
        });
        throw new Error("Unknown error occurred");
    }

    update(combo: WrapperBoxCombo): void {
        this.client.query('UPDATE combos SET wrapperId = $1, boxId = $2, name = $3, price = $4 WHERE _id = $5',
            [combo.wrapperId, combo.boxId, combo.name, combo.price, combo._id], (err: Error, res: QueryResult) => {
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

    getCount(): number {
        var count: number = 0;
        this.client.query('SELECT COUNT(*) FROM combos', (err: Error, res: QueryResult) => {
            if (err) {
                console.log(err.message);
            } else {
                count = res.rows[0].count;
            }
        });
        return count;
    }
}

export { PGBoxRepository, PGWrapperRepository, PGSuppliedWrapperRepository, PGSupplierRepository, PGComboRepository };