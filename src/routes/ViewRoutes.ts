import { Router, Request, Response } from "express";
import ProductService from "../services/ProductService.js";
import ProductRepository from "../repositories/ProductRepository.js";

const router = Router();

const productService = new ProductService(new ProductRepository);

router.get("/", async (req: Request, res: Response) => {
    try {
        const result = await productService.getAllProducts(1, 10);
        res.render("pages/index", { data: result.data });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.get("/create", (req: Request, res: Response) => {
    res.render("pages/create");
});

router.post("/create", async (req: Request, res: Response) => {
    try {
        await productService.createProduct({
            name: req.body.name,
            price: Number(req.body.price),
            quantity: Number(req.body.quantity),
        });
        res.redirect("/");
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/edit/:id', async (req: Request, res: Response) => {
    let id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid ID");
    const result = await productService.getProductById(id);
    if (!result) return res.status(404).send("Product not found");
    res.render("pages/edit", { data: result });
})

router.post('/edit/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).send("Invalid ID");
        const name = req.body.name?.trim();
        const price = Number(req.body.price);
        const quantity = Number(req.body.quantity);
        if (!name) return res.status(400).send("Name is required");
        if (isNaN(price) || price <= 0) return res.status(400).send("Invalid Price");
        if (isNaN(quantity) || quantity <= 0) return res.status(400).send("Invalid quantity");
        await productService.updateProduct(id, { name, price, quantity });
        res.redirect('/');
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.post('/delete/:id', async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).send("Invalid ID");
        const product = await productService.getProductById(id);
        if (!product) return res.status(404).send("Product not found");
        res.redirect('/');
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

export default router;