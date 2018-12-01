const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({

  picture: {
    type: String
  },

  extract: {
    type: String
  },

  description: {
    type: String
  },

  title: {
    type: String,
    required: true
  },

  original: {
    type: String,
    required: true,
    unique: true
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});

module.exports = mongoose.model("Keyword", KeywordSchema);
