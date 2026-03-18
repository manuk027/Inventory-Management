import express, { Application } from 'express';
import productRoutes from './routes/ProductRoutes.js';

const app: Application = express();
app.use(express.json());
app.use('/products', productRoutes);
export default app;