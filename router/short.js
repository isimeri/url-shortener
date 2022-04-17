const express = require('express');
const dns = require('dns');
const shortid = require('shortid');
const validUrl = require('valid-url');
const urlModel = require('../db/urlModel.js');

const router = express.Router();

router.post('/', async (req, res) => {
    const longUrl = req.body.url;
    const shortCode = shortid.generate();
  
    if(validUrl.isUri(longUrl)){
      const trimmedUrl = longUrl.split('://')[1];
      let hostname;
      if(trimmedUrl){
        hostname = trimmedUrl.split('/')[0];
      } else {
        return res.status(400).json({error: "invalid url"});
      }
      
      dns.lookup(hostname, async (err, address) => {
        if(err){
          return res.status(400).json({error: "invalid hostname"});
        } else {
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
              return res.json({original_url: urlDoc.longUrl, short_url: urlDoc.shortCode});
            }
          } catch (err) {
            console.error(err);
            return res.status(500).json(err);
          }
        }
      });
    } else {
      return res.status(400).json({error: "invalid url"});
    }
  }
);
router.get('/:shortUrl', async (req,res) => {
    const url =  await urlModel.findOne({ shortCode: req.params.shortUrl });
    if(!url){
      return res.status(404).json({msg: "url not found"});
    }
    res.redirect(url.longUrl);
  
  }
);

module.exports = router;