import express from 'express';
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./routes/api/auth');
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
app.use(cors())

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/recording', require('./routes/api/recording'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));