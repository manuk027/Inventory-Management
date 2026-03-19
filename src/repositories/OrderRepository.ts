import { IOrderRepository, Order, } from "../interfaces/IOrderRepository.js";
import { db } from '../config/db.js';

class OrderRepository implements IOrderRepository {
    async create(order: { product_id: number; quantity: number; total_price: number; }): Promise<Order> {
        const pool = db.getPool();
        const query = `INSERT INTO orders (product_id, quantity, total_price) VALUES (?, ?, ?)`;
        const [result]: any = await pool.execute(query, [order.product_id, order.quantity, order.total_price]);
        return {
            id: result.insertId,
            product_id: order.product_id,
            quantity: order.quantity,
            total_price: order.total_price,
            created_at: new Date(),
        }
    };
    async findAll(page: number, limit: number): Promise<{ data: Order[]; total: number; }> {
        const pool = db.getPool();
        const offset = (page - 1) * limit;
        const query = `SELECT * FROM orders LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) AS total FROM orders`;
        const [rows]: any = await pool.execute(query, [limit, offset]);
        const [countResult]: any = await pool.execute(countQuery);
        return {
            data: rows,
            total: countResult[0].total
        };
    };
    async findById(id: number): Promise<Order | null> {
        const pool = db.getPool();
        const query = `SELECT * FROM orders WHERE id = ?`;
        const [rows]: any = await pool.execute(query, [id]);
        if (rows.length === 0) return null;
        return rows[0];
    }
}