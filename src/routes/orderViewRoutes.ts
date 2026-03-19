import { Router, Request, Response } from "express";
import OrderService from "../services/OrderService.js";
import OrderRepository from "../repositories/OrderRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";

const router = Router();

const orderService = new OrderService(
    new OrderRepository(),
    new ProductRepository()
);

router.get("/", async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        if ((req.query.page && isNaN(page)) || (req.query.limit && isNaN(limit))) {
            return res.status(400).send("Invalid pagination values");
        }

        const safePage = page > 0 ? page : 1;
        const safeLimit = limit > 0 ? limit : 10;

        const result = await orderService.getAllOrders(safePage, safeLimit);
        const pages = Array.from(
            { length: result.totalPages },
            (_, i) => i + 1
        );
        res.render("pages/orders/index", {
            data: result.data,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            pages
        });

    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.get("/create", async (req: Request, res: Response) => {
    const productRepo = new ProductRepository();
    const products = await productRepo.findAll(1, 100);
    res.render("pages/orders/create", { products: products.data });
});

router.post("/create", async (req: Request, res: Response) => {
    try {
        const product_id = Number(req.body.product_id);
        const quantity = Number(req.body.quantity);
        if (isNaN(product_id) || isNaN(quantity) || quantity <= 0) {
            return res.status(400).send("Invalid input");
        }
        await orderService.createOrder({ product_id, quantity });
        res.redirect("/orders");
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;