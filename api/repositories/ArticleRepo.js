const toObjectId = require('mongoose').Types.ObjectId;
const Article = new require('../models/Article');

class ArticleRepo {

  createArticle( body ) {
    return Article.create( body );
  }

  getArticleById ( _id ) {
    return Article.findOne( { _id } );
  }

}

module.exports = new ArticleRepo();
