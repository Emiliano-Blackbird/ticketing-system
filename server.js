import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT || 3000;  // Use environment variable for port if available
const server = app.listen(port, () => {
    console.log(`Enviroment: ${process.env.NODE_ENV}`);
    console.log(`Server is running at http://localhost:${port}`);
});

export default server;
