export interface Order {
    id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    created_at: Date;
}

export interface CreateOrder {
    product_id: number;
    quantity: number;
}

export interface IOrderRepository {
    create(order: { product_id: number; quantity: number; total_price: number; }): Promise<Order>;
    findAll(page: number, limit: number): Promise<{ data: Order[]; total: number; }>;
    findById(id: number): Promise<Order | null>;
}