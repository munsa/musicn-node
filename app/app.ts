import express from 'express';
import connectDB from '../config/db';
import {errorHandlerWrapper} from '../middleware/error'
import cors from 'cors';

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Enable CORS
app.use(cors())

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('../routes/api/auth'));
app.use('/api/profile', require('../routes/api/profile'));
app.use('/api/recording', require('../routes/api/recording'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));