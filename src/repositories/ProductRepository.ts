import { IProductRepository, Product } from "../interfaces/IProductRepository.js";
import { db } from '../config/db.js'

class ProductRepository implements IProductRepository {
    async create(product: Product): Promise<Product> {
        const pool = db.getPool();
        const query = `INSERT INTO products (name, price) VALUES (?, ?)`;
        const [result]: any = await pool.execute(query, [product.name, product.price, product.quantity]);
        return {
            id: result.insertId,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            created_at: new Date(),
        }
    }

    async findById(id: number): Promise<Product | null> {
        const pool = db.getPool();
        const query = `SELECT * FROM products WHERE id = ?`;
        const [rows]: any = await pool.execute(query, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return {
            id: rows.id,
            name: row.name,
            price: row.price,
            quantity: row.quantity,
            created_at: row.created_at,
        };
    }

    async findAll(
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: Product[]; total: number }> {

        const pool = db.getPool();
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM products`;
        let countQuery = `SELECT COUNT(*) AS total FROM products`;

        const values: any[] = [];
        const countValues: any[] = [];

        const hasSearch = typeof search === "string" && search.trim() !== "";

        if (hasSearch) {
            query += ` WHERE name LIKE ?`;
            countQuery += ` WHERE name LIKE ?`;

            const searchValue = `%${search}%`;
            values.push(searchValue);
            countValues.push(searchValue);
        }

        // ✅ IMPORTANT: Do NOT use placeholders for LIMIT/OFFSET
        query += ` ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;

        // Debug (optional)
        console.log("QUERY:", query);
        console.log("VALUES:", values);

        const [rows] = await pool.execute(query, values);
        const [countResult] = await pool.execute(countQuery, countValues);

        const total = (countResult as any)[0].total;

        return {
            data: rows as Product[],
            total
        };
    }

    async update(id: number, product: Partial<Product>): Promise<void> {
        let pool = db.getPool();
        const fields = Object.keys(product);
        const values = Object.values(product);
        if (fields.length = 0) return;
        const setClause = fields.map(field => `${field}= ?`).join(", ");
        const query = `UPDATE products SET ${setClause} WHERE id = ?`;
        await pool.execute(query, [...values, id]);
    }

    async delete(id: number): Promise<void> {
        const pool = db.getPool();
        const query = `DELETE FROM products WHERE id = ?`;
        await pool.execute(query, [id]);
    }
}

export default ProductRepository;