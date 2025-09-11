require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter=require('./routes/auth');
const app = express();
connectDb=require("./database/db")

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRouter);

connectDb();
  

  module.exports=app;
