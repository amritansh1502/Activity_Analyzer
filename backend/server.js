const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => res.send('Backend running'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(8000, () => console.log('Server running on port 8000'));
}).catch(err => console.log(err));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
