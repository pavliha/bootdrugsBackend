const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({

  text: {
    type: String
  },

  title: {
    type: String
  }

}, {
  versionKey: false,
  toObject: { getters: true },
  id: false,
});

module.exports = mongoose.model("Article", ArticleSchema);
