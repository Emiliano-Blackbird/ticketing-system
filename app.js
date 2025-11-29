import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from './helpers/rateLimit.js';
import usersRoutes from './routes/usersRoutes.js';
import ticketsRoutes from './routes/ticketsRoutes.js';
import error from './middlewares/error.js';

const app = express();

const DB_URL =
    process.env.NODE_ENV === 'test'
    ? 'mongodb://localhost:27017/tickets-db-test'
    : process.env.DB_URL || 'mongodb://localhost:27017/tickets-db';

mongoose
    .connect(DB_URL)
    .then(() => console.log(`Connected to MongoDB at ${DB_URL}`))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(morgan('dev'));  // Logging middleware
app.use(helmet());  // Security middleware
app.use(cors());  // Enable CORS
if (process.env.NODE_ENV === 'production') {
    app.use(compression());  // Compression middleware for production
    app.use(rateLimit);  // Apply rate limiting in production
}
app.use(express.json());  // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
    res.status(200).send('Server is running!');  // code 200 indicates success
});

app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use(error);  // Error handling middleware

export default app;
