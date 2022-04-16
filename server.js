require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./db/connection.js');
const shortRouter = require('./router/short.js');

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
