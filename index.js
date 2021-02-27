const express = require('express');
const router = require('./routes/auth');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const postRouter = require('./routes/posts');

const app = express();

// MongoDB connection 
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => console.log('MongoDB Connected.'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());

// Router Middleware
app.use('/api/users', router);
app.use('/posts', postRouter);



const port = process.env.PORT || 5000;
app.listen(port);