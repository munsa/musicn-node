import express from 'express';
import {CustomError} from './utils/error/customError';
import apiRouter from './routes';
import avatarsMiddleware from 'adorable-avatars';

const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Connect Database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log('MongoDB Connected...');
}, (err) => {
  console.log('ERROR: ' + err.message);
  process.exit(1);
})

// Init Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

// Use Adorable Avatars
app.use('/avatar', avatarsMiddleware);

// Define Routes
app.use(apiRouter);

app.all('*', async (req, res, next) => {
  const err = new CustomError(
    `${req.originalUrl} does not exist on the server`,
    404
  );

  next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));