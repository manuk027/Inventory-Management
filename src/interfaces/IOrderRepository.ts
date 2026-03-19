export interface Order {
    id: number;
    product_id: number;
    product_name?: string;
    quantity: number;
    total_price: number;
    created_at: Date;
}

export interface CreateOrder {
    product_id: number;
    quantity: number;
}

export interface OrderInsert {
    product_id: number;
    quantity: number;
    total_price: number;
}

export interface IOrderRepository {
    create(order: OrderInsert): Promise<Order>;
    findAll(page: number, limit: number): Promise<{
        data: Order[];
        total: number;
        currentPage: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Order | null>;
}