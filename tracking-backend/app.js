require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'tracking-backend' });
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  module.exports=app;
