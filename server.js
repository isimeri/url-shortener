require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');
const shortid = require('shortid');
const validUrl = require('valid-url');
const app = express();

const connectDB = require('./db/connection.js');
const urlModel = require('./db/urlModel.js');
const shortRouter = require('./router/shorten.js');

//mongodb connect
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
//     console.log("mongodb connected")
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// }
// const urlSchema = new mongoose.Schema({
//   longUrl: {type: String, required: true},
//   shortCode: {type: String}
// });
// const urlModel = mongoose.model("url", urlSchema);
connectDB();

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}));
app.use('/api/short', shortRouter);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
