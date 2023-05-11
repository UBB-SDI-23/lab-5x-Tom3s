import { Client } from "pg";
import { Token } from "./userEntities";

class AuthRepo {

    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }

    async checkIfUserExists(username: string): Promise<boolean> {
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await this.client.query(query, values);
        return result.rowCount > 0;
    }

    registerUser(username: string, passwordHash: string): void {
        const query = "INSERT INTO users (username, passwordhash) VALUES ($1, $2)";
        const values = [username, passwordHash];
        this.client.query(query, values);
    }

    async verifyUser(username: string, passwordHash: string): Promise<boolean> {
        const query = "SELECT * FROM users WHERE username = $1 AND passwordhash = $2";
        const values = [username, passwordHash];
        const result = await this.client.query(query, values);
        return result.rowCount > 0;
    }

}

export default AuthRepo;
