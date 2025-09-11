const mongoose = require('mongoose');
const connectDb=()=>{
    mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
};

  module.exports=connectDb;