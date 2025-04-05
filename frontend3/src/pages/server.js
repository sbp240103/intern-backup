import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3019;
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './App.jsx'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});