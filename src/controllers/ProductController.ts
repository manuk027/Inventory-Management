import { Request, Response } from "express";
import ProductService from "../services/ProductService.js";
import ProductRepository from "../repositories/ProductRepository.js";

class ProductController {
    private productService: ProductService;
    constructor() {
        this.productService = new ProductService(new ProductRepository());
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getProductById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
            const product = await this.productService.getProductById(id);
            if (!product) return res.status(404).json({ message: "Product not found" });
            res.json({ data: product });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    getAllProducts = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const result = await this.productService.getAllProducts(page, limit, search);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    updateProduct = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
            await this.productService.updateProduct(id, req.body);
            res.status(200).json({ message: "Product updated successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
            await this.productService.deleteProduct(id);
            res.status(200).json({ message: "Product Deleted Successfully" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };
}

export default ProductController;