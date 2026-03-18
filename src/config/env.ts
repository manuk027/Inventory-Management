import dotenv from 'dotenv';
dotenv.config();

class EnvConfig {
    private readonly PORT: number;
    private readonly DB_HOST: string;
    private readonly DB_USER: string;
    private readonly DB_PASSWORD: string;
    private readonly DB_NAME: string;

    constructor() {
        this.PORT = Number(process.env.PORT) || 3000;
        this.DB_HOST = this.getEnv('DB_HOST');
        this.DB_USER = this.getEnv('DB_USER');
        this.DB_PASSWORD = '';
        this.DB_NAME = this.getEnv('DB_NAME');
    }

    private getEnv(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing environment variable ${key}`);
        }
        return value;
    }

    public getPort(): number {
        return this.PORT;
    }

    public getDbHost(): string {
        return this.DB_HOST;
    }

    public getDbUser(): string {
        return this.DB_USER;
    }

    public getDbPassword(): string {
        return this.DB_PASSWORD;
    }

    public getDbName(): string {
        return this.DB_NAME;
    }
};

export const env = new EnvConfig();