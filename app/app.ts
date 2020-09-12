import express from 'express';
import connectDB from '../config/db';
import {errorHandlerWrapper} from '../middleware/error'

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('../routes/api/auth'));
app.use('/api/profile', require('../routes/api/profile'));
app.use('/api/recording', require('../routes/api/recording'));
app.use('/api/spotify', require('../routes/api/spotify'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));