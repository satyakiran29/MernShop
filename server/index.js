import path from 'path';
import express from 'express';
import https from 'https';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Static folder for uploads
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/server/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Custom error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Add cron job like self-ping to keep the server awake on Render
    if (process.env.RENDER_EXTERNAL_URL) {
        setInterval(() => {
            https.get(process.env.RENDER_EXTERNAL_URL, (res) => {
                console.log(`Keep-alive ping to ${process.env.RENDER_EXTERNAL_URL} - Status: ${res.statusCode}`);
            }).on('error', (e) => {
                console.error(`Keep-alive ping error: ${e.message}`);
            });
        }, 14 * 60 * 1000); // 14 minutes
    }
});
