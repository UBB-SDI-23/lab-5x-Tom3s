import { Client } from "pg";
import { Token, UserDetails } from "./userEntities";

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

        if (result.rowCount > 0) {
            console.log(result.rows[0].username);
            console.log(result.rows[0].passwordhash);
            return true;
        }

        return false;
    }

}

class UserRepository {
    
    private client: Client;

    constructor() {
        this.client = new Client({
            connectionString: process.env.PG_CONN_STRING,
        });
        this.client.connect();
    }


    async getUserById(id: number): Promise<UserDetails> {
        const query = "SELECT u.username, ud.userid, ud.email, ud.birthday, ud.gender, ud.nickname, ud.eyecolor FROM users u INNER JOIN userdetails ud ON u.id = ud.userid WHERE u.id = $1;";
        const values = [id];
        const result = await this.client.query(query, values);
        return result.rows[0] as UserDetails;
    }

    async getUsernameById(id: number): Promise<string> {
        const query = "SELECT username FROM users WHERE id = $1";
        const values = [id];
        const result = await this.client.query(query, values);
        return result.rows[0].username;
    }

    async checkIfUserExists(id: number): Promise<boolean> {
        const query = "SELECT * FROM users WHERE id = $1";
        const values = [id];
        const result = await this.client.query(query, values);
        return result.rowCount > 0;
    }
}

export { AuthRepo, UserRepository };
