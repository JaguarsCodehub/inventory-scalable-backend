import express, { Application } from 'express';
import { json } from 'body-parser';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.route';
import authRouter from './auth/routes/auth.route';
import orderRoutes from './routes/order.route';
import deliveryRoutes from './routes/delivery.route';

const app: Application = express();

app.use(json());

// Use the auth routes
app.use('/api/auth', authRouter);

app.use('/api/users', userRoutes);

app.use('/api/stock', productRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);

export default app;
