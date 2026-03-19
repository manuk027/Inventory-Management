import { Request, Response } from "express";
import OrderService from "../services/OrdersServices.js";
import OrderRepository from "../repositories/OrderRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";

class OrderController {
    private orderService: OrderService;
    constructor() {
        this.orderService = new OrderService(
            new OrderRepository(),
            new ProductRepository()
        );
    }
    createOrder = async (req: Request, res: Response) => {
        try {
            const product_id = Number(req.body.product_id);
            const quantity = Number(req.body.quantity);
            if (isNaN(product_id) || isNaN(quantity)) {
                return res.status(400).json({ message: "Invalid input" });
            }
            const order = await this.orderService.createOrder({
                product_id,
                quantity
            });
            res.status(201).json(order);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
    getAllOrders = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await this.orderService.getAllOrders(page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
    getOrderById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid ID" });
            }
            const order = await this.orderService.getOrderById(id);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}

export default OrderController;