import express, { Application } from 'express';
import { json } from 'body-parser';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.route';
import authRouter from './auth/routes/auth.route';

const app: Application = express();

app.use(json());
app.use('/api/users', userRoutes);
app.use('/api/stock', productRoutes)
// Use the auth routes
app.use('/api/auth', authRouter);

export default app;
