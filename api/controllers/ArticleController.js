const BaseController = require('./BaseController');
const ArticleRepo = require('../repositories/ArticleRepo');
const KeywordRepo = require('../repositories/KeywordRepo');
const RegexData = require('../helpers/RegexData');

class ArticleController extends BaseController {

  async getArticleById ( req, res, next ) {

    let _id = req.params.id;

    let article = await ArticleRepo.getArticleById(_id);
    let keywords = [];
    if ( article ) {
      let kwords = RegexData(article.text );
      kwords = kwords.map( el => el.original);

      keywords = await KeywordRepo.findKeywordsArray(kwords);

    } else{
      article = null;
    }

    super.responseJSON(article ? 201 : 404, res, { article, keywords })

  }

}

module.exports = new ArticleController();
