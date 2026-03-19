import { IOrderRepository, Order, CreateOrder } from "../interfaces/IOrderRepository.js";
import { IProductRepository } from "../interfaces/IProductRepository.js";

class OrderService {
    private orderRepository: IOrderRepository;
    private productRepository: IProductRepository;
    constructor(orderRepository: IOrderRepository, productRepository: IProductRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }
    async createOrder(order: CreateOrder): Promise<Order> {
        if (order.quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        const product = await this.productRepository.findById(order.product_id);

        if (!product) {
            throw new Error("Product not found");
        }

        if (order.quantity > product.quantity) {
            throw new Error("Insufficient stock");
        }

        const total_price = product.price * order.quantity;

        const newQuantity = product.quantity - order.quantity;

        await this.productRepository.update(product.id, {
            quantity: newQuantity
        });

        return this.orderRepository.create({
            product_id: order.product_id,
            quantity: order.quantity,
            total_price
        });
    }
    async getAllOrders(page: number, limit: number) {
        return this.orderRepository.findAll(page, limit);
    }
    async getOrderById(id: number) {
        return this.orderRepository.findById(id);
    }
}

export default OrderService;