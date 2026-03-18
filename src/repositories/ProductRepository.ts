import { IProductRepository, Product } from "../interfaces/IProductRepository.js";

import { db } from '../config/db.js'

class ProductRepository implements IProductRepository {
    async create(product: Product): Promise<Product> {
        const pool = db.getPool();
        const query = `INSERT INTO products (name, price) VALUES (?, ?)`;
        const [result]: any = await pool.execute(query, [product.name, product.price]);
        return {
            id: result.insertId,
            name: product.name,
            price: product.price,
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
            created_at: row.created_at,
        };
    }

    async findAll(page: number, limit: number, search?: string): Promise<{ data: Product[], total: number }> {
        let pool = db.getPool();
        const offset = (page - 1) * limit;
        let query = `SELECT * FROM products`;
        let countQuery = `SELECT COUNT(*) AS total FROM  products`;
        let values: any[] = [];
        if (search) {
            query += ` WHERE name LIKE ?`; //select * form products where name like ?;
            countQuery += ` WHERE name LIKE ?`; //select count(*) as total from products where name like ?;
            values.push(`%${search}%`);
        }
        query += ` LIMIT ? OFFSET ?`; //select * form products where name like ? limit ? offset ? ;
        values.push(limit, offset); //values = ['%val%', limit, offset]
        let [rows]: any = await pool.execute(query, values);
        const [countResult]: any = await pool.execute(countQuery, search ? [`%${search}%`] : []);
        const total = countResult[0].total;
        return { data: rows, total };
        //2, 3, a
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