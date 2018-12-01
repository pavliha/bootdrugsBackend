const toObjectId = require('mongoose').Types.ObjectId;
const Keyword = require('../models/Keyword');
const Article = new require('../models/Article');

const percent = require('percent');

class KeywordRepo {

  async createKeyword( body ) {
    return Keyword.insertMany( body, { ordered: false });
  }

  async findKeywordsArray ( data ) {
    return Keyword.find ( {original: { $in: data } });
  }

  async getKeywordById ( _id ) {
    let kword = await Keyword.findOne({_id}).lean();
    let articals = await Article.find({ "text": { "$regex": kword.original, "$options": "i" } });

    kword.articals = articals;
    return kword;
  }

}

module.exports = new KeywordRepo();
