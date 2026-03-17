import dotenv from 'dotenv';

class EnvConfig {
    private readonly PORT: number;
    constructor() {
        dotenv.config();
        this.PORT = Number(process.env.PORT) || 3000;
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
}

export const env = new EnvConfig();