const BaseController = require('./BaseController');
const getWikiDetails = require('../helpers/getWikiDetails');
const ArticleRepo = require('../repositories/ArticleRepo');
const RegexData = require('../helpers/RegexData');

class AnalyzeController extends BaseController {

  async analyzer ( req, res, next ) {

    let body = req.body;

    let mainSearch = RegexData(body.text);

    await Promise.all(
      mainSearch.map ( async (el, index) => {
        mainSearch[index]['data'] = await getWikiDetails(el.keyword, el.original);
      })
    );

    let article = await ArticleRepo.createArticle(body);

    super.responseJSON(201, res, { _id: article._id })

  }

}

module.exports = new AnalyzeController();
