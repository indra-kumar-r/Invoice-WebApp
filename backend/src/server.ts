import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4500;

app.use(cors());
app.use(express.json(), express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with ES6!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
