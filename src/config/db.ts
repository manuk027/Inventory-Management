import mysql, { Pool } from 'mysql2/promise';
import { env } from '../config/env.js';

class Database {
    private pool: Pool;
    constructor() {
        this.pool = mysql.createPool({
            host: env.getDbHost(),
            user: env.getDbUser(),
            password: env.getDbPassword(),
            database: env.getDbName(),
            waitForConnections: true,
            connectionLimit: 10,
        });
    }
    public getPool(): Pool {
        return this.pool;
    }
}

export const db = new Database();