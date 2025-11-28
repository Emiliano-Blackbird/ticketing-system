import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import usersRoutes from './routes/usersRoutes.js';
import ticketsRoutes from './routes/ticketsRoutes.js';

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
app.use(express.json());  // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
    res.status(200).send('Server is running!');  // code 200 indicates success
});

app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);

export default app;
