import express, { Application } from 'express';
import { json } from 'body-parser';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.route';

const app: Application = express();

app.use(json());
app.use('/api/users', userRoutes);
app.use('/api/stock', productRoutes)


export default app;
