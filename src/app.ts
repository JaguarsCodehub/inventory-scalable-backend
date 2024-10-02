// src/app.ts

import express, { Application } from 'express';
import { json } from 'body-parser'; // Import body-parser for parsing JSON request bodies
import userRoutes from './routes/user.routes'; // Import user routes

// Create an instance of the Express application
const app: Application = express();

// Middleware
app.use(json()); // Use body-parser middleware to parse JSON requests

// Define application routes
app.use('/api/users', userRoutes); // Route for user-related API endpoints

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app; // Export the app instance to be used in server.ts
