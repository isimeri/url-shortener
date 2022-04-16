const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: {type: String, required: true},
    shortCode: {type: String}
  });

const urlModel = new mongoose.model('url', urlSchema);

module.exports = urlModel;