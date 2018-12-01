const toObjectId = require('mongoose').Types.ObjectId;
const Article = new require('../models/Article');
const Keyword = new require('../models/Keyword');
const { orderBy } = require('lodash');
const percent = require('percent');


class ArticleRepo {

  async getAllTrends( ) {
    let kwords = await Keyword.find().lean();
    let AllCount = await Article.find().countDocuments();


    kwords = await Promise.all(
      kwords.map ( async (el) => {
        let count = await Article.find({ "text": { "$regex": el.original, "$options": "i" } }).countDocuments();
        el.percent = parseInt(percent.calc(count, AllCount, 0));
        return el;
      })
    );
    kwords = orderBy (kwords, 'percent', 'desc');
    return kwords;

  }

}

module.exports = new ArticleRepo();
