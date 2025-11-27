import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));  // Logging middleware
app.use(express.json());  // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
    res.status(200).send('Server is running!');  // code 200 indicates success
});

export default app;
