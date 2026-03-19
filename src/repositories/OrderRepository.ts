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
    async findAll(page: number, limit: number) {
        const pool = db.getPool();

        const safePage = page > 0 ? page : 1;
        const safeLimit = limit > 0 ? limit : 10;

        const offset = (safePage - 1) * safeLimit;

        const query = `
        SELECT 
            orders.*,
            products.name AS product_name
        FROM orders
        JOIN products ON orders.product_id = products.id
        LIMIT ${safeLimit} OFFSET ${offset}
    `;

        const countQuery = `SELECT COUNT(*) AS total FROM orders`;

        const [rows]: any = await pool.execute(query);
        const [countResult]: any = await pool.execute(countQuery);

        const total = countResult[0].total;
        const totalPages = Math.max(1, Math.ceil(total / safeLimit));

        return {
            data: rows,
            total,
            currentPage: safePage,
            totalPages
        };
    }
    async findById(id: number): Promise<Order | null> {
        const pool = db.getPool();
        const query = `SELECT * FROM orders WHERE id = ?`;
        const [rows]: any = await pool.execute(query, [id]);
        if (rows.length === 0) return null;
        return rows[0];
    }
}

export default OrderRepository;