import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import menuSectionRoutes from './routes/menuSection';
import productRoutes from './routes/product';
import shopRoutes from './routes/shop';
import { generalLimiter } from './middleware/rateLimit';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/menu-sections', menuSectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Products server is running' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

export default app;
