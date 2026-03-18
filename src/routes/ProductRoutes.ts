import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const productRoutes = Router();
const productController = new ProductController();

productRoutes.post('/', productController.createProduct);
productRoutes.get('/', productController.getAllProducts);
productRoutes.get('/:id', productController.getProductById)
productRoutes.put('/:id', productController.updateProduct);
productRoutes.delete('/:id', productController.deleteProduct);

export default productRoutes;