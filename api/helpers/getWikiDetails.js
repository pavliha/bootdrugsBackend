const axios = require('axios');
const cheerio = require('cheerio');
const KeywordRepo = require('../repositories/KeywordRepo');

module.exports = async ( title, original ) => {
  let mainData = [];
  let data = [];
  let search = await axios.get('https://ru.wikipedia.org/w/api.php', {
    params: {
      action: 'query',
      list: 'search',
      format: 'json',
      srsearch: title
    }
  });

  if (! search.data.query.search[0] ) {
    return null;
  }

  let firstElemTitle = search.data.query.search[0].title;

  let {displaytitle, description, extract, thumbnail} = (await axios
    .get('https://ru.wikipedia.org/api/rest_v1/page/summary/' +
      encodeURIComponent(firstElemTitle)
    )).data;

  let mainPicture = thumbnail ? thumbnail.source : '';
  mainData.push({displaytitle, description, extract, picture: mainPicture });
  data.push({title:displaytitle, description, extract, picture: mainPicture , original});

  search = await axios.get('https://ru.wikipedia.org/api/rest_v1/page/html/'+
    encodeURIComponent(firstElemTitle));

  const $ = cheerio.load(search.data);
  let urlsArray = $('a').prop('rel', 'mw:WikiLink').splice(1, 10);

  await Promise.all(
    urlsArray.map( async el => {

      try {
        let {displaytitle, description, extract, thumbnail} = (await axios
          .get('https://ru.wikipedia.org/api/rest_v1/page/summary/' +
            encodeURIComponent(el.attribs.href.replace('./', ''))
          )).data;

        let picture = thumbnail ? thumbnail.source : '';
        data.push({title: displaytitle, description, extract, picture});

      } catch (e) {
        return e;
      }
    })
  );

  KeywordRepo.createKeyword(data ).catch( err => err );
  return mainData;
};