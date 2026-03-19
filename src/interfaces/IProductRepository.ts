export interface Product {
    id: number,
    name: string,
    price: number,
    quantity: number;
    created_at: Date;
}

export interface IProductRepository {
    create(product: CreateProduct): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(page: number, limit: number, search?: string): Promise<{ data: Product[], total: number }>;
    update(id: number, product: Partial<Product>): Promise<void>;
    delete(id: number): Promise<void>;
}

export interface CreateProduct {
    name: string;
    price: number;
    quantity: number;
}