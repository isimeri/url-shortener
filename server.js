require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const shortid = require('shortid');
const app = express();

//mongodb connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("mongodb coneected")
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
const urlSchema = new mongoose.Schema({
  longUrl: {type: String, required: true},
  shortCode: {type: String}
});
const urlModel = mongoose.model("url", urlSchema);
connectDB();

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/short', async (req, res) => {
  const longUrl = req.body.url;
  const shortCode = shortid.generate();

  try {
    let urlDoc = await urlModel.findOne({longUrl});
    if(urlDoc){
      return res.json(urlDoc);
    } else {
      urlDoc = new urlModel({
        longUrl,
        shortCode
      });

      await urlDoc.save();
      res.json({longUrl: urlDoc.longUrl, shortCode: urlDoc.shortCode});
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
});
app.get('/api/short/:shortUrl', async (req,res) => {
  const url =  await urlModel.findOne({ shortCode: req.params.shortUrl });
  if(!url){
    return res.status(404).json({msg: "url not found"});
  }
  res.redirect(url.longUrl);

});

app.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});
