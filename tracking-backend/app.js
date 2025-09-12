require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter=require('./routes/auth');
const app = express();
connectDb=require("./database/db")
const appOrigin=process.env.FRONTEND_URL||"http://localhost:5174"
app.use(cors({
  origin: appOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth',authRouter);


  module.exports=app;
