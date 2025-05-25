import app from './app.js';
import connectDB from './db.js';

const PORT = process.env.PORT || 4750;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};

startServer();
