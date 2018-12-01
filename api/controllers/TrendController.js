const BaseController = require('./BaseController');
const TrendRepo = require('../repositories/TrendRepo');
const KeywordRepo = require('../repositories/KeywordRepo');
const getWikiDetails = require('../helpers/getWikiDetails');

const Morphy = require('phpmorphy').default;

const morphy = new Morphy('ru', {
  storage:             Morphy.STORAGE_MEM,
  predict_by_suffix:   true,
  predict_by_db:       true,
  graminfo_as_text:    true,
  use_ancodes_cache:   false,
  resolve_ancodes:     Morphy.RESOLVE_ANCODES_AS_TEXT
});


class TrendController extends BaseController {

  async getAllTrends ( req, res, next ) {

    let trends = await TrendRepo.getAllTrends();

    super.responseJSON(trends ? 201 : 404, res, { trends })

  }

  async getKeywordById ( req, res, next ) {

    let _id = req.params.id;

    let keyword = await KeywordRepo.getKeywordById(_id);

    super.responseJSON(keyword ? 201 : 404, res, { keyword })

  }

  async addKeyword ( req, res, next ) {
    let text = req.body.text.trim();

    let keyword = await getWikiDetails(morphy.lemmatize(text.trim())[0], text);

    super.responseJSON(keyword ? 201 : 404, res, { keyword })

  }

}

module.exports = new TrendController();
