require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter=require('./routes/auth');
const superAdminRouter=require('./routes/superAdmin');
const app = express();

connectDb=require("./database/db")
const appOrigin= "http://localhost:5174"// process.env.FRONTEND_URL||
app.use(cors({
  origin: appOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth',authRouter);
app.use('/api/superadmin',superAdminRouter);

  module.exports=app;
 