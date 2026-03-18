import { IProductRepository, Product } from "../interfaces/IProductRepository.js";

class ProductService {
    private productRepository: IProductRepository;
    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(product: Product): Promise<Product> {
        if (product.quantity < 0) throw new Error("Quantity cannot be negative");
        return this.productRepository.create(product);
    }
    async getProductById(id: number): Promise<Product | null> {
        return this.productRepository.findById(id);
    }
    async getAllProducts(page: number, limit: number, search?: string): Promise<{ data: Product[], total: number }> {
        console.log("asfd")
        return this.productRepository.findAll(page, limit, search);
    }
    async updateProduct(id: number, product: Partial<Product>): Promise<void> {
        if (product.quantity !== undefined && product.quantity < 0) throw new Error("Quantity cannot be negative");
        return this.productRepository.update(id, product);
    }
    async deleteProduct(id: number): Promise<void> {
        return this.productRepository.delete(id);
    }
}

export default ProductService;