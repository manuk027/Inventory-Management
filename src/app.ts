import express, { Application } from 'express';
import productRoutes from './routes/ProductRoutes.js';
import viewRoutes from './routes/ViewRoutes.js';
import path from 'path';
import hbs from 'hbs';

const app: Application = express();

app.set("view engine", "hbs");
app.set("views", path.join(process.cwd(), "src/views"));

hbs.registerPartials(path.join(process.cwd(), "src/views/partials"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productRoutes);
app.use("/", viewRoutes);

export default app;