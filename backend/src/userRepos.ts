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

    async checkIfUserExists(username: string): Promise<number> {
        const query = "SELECT id FROM users WHERE username = $1";
        const values = [username];
        const result = await this.client.query(query, values);
        
        if (result.rowCount > 0) {
            return result.rows[0].id;
        }
        return -1;
    }

    async registerUser(username: string, passwordHash: string): Promise<void> {
        const query = "INSERT INTO users (username, passwordhash) VALUES ($1, $2) RETURNING id";
        const values = [username, passwordHash];
        const result = await this.client.query(query, values);

        const userid = result.rows[0].id;
        const query2 = "INSERT INTO userdetails (userid) VALUES ($1)";
        const values2 = [userid];
        this.client.query(query2, values2);
    }

    async verifyUser(username: string, passwordHash: string): Promise<string> {
        const query = "SELECT role FROM users WHERE username = $1 AND passwordhash = $2";
        const values = [username, passwordHash];
        const result = await this.client.query(query, values);

        if (result.rowCount > 0) {
            return result.rows[0].role;
        }

        return "";
    }

    updateUserRole(id: number, role: string): void {
        const query = "UPDATE users SET role = $1 WHERE id = $2";
        const values = [role, id];
        this.client.query(query, values);
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
        const query = "SELECT u.username, u.role, ud.userid, ud.email, ud.birthday, ud.gender, ud.nickname, ud.eyecolor FROM users u LEFT JOIN userdetails ud ON u.id = ud.userid WHERE u.id = $1;";
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

    updateUserDetails(id: number, details: any): void {
        const query = "UPDATE userdetails SET nickname = $1, email = $2, birthday = $3, gender = $4, eyecolor = $5 WHERE userid = $6";
        const values = [details.nickname, details.email, details.birthday, details.gender, details.eyecolor, id];
        this.client.query(query, values);
    }
}

export { AuthRepo, UserRepository };
