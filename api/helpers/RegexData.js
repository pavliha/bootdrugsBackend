const Morphy = require('phpmorphy').default;

const morphy = new Morphy('ru', {
  storage:             Morphy.STORAGE_MEM,
  predict_by_suffix:   true,
  predict_by_db:       true,
  graminfo_as_text:    true,
  use_ancodes_cache:   false,
  resolve_ancodes:     Morphy.RESOLVE_ANCODES_AS_TEXT
});

function strip_tags( str ){ // Strip HTML and PHP tags from a string
  return str.replace(/<\/?[^>]+>/gi, '');
}

module.exports = ( text ) => {

  text = strip_tags(text);

  let mainSearch = text.match( /([А-ЯЁ][а-яё]+[\s]*)+/g )
    .filter( el => el.length > 4 )
    .map( el => {
      let kword = morphy.lemmatize(el.trim());
      kword = kword.length > 1 ?
        kword[0].charAt(0) + kword[0].substr(1).toLowerCase() :
        kword.toString().charAt(0) + kword.toString().substr(1).toLowerCase();
      return {
        original: el.trim(),
        keyword: kword
      }
    });
  let searchName = text.match( /([А-ЯЁ]+[ .]+[А-ЯЁ]+([а-яё-])*)+/g )
    .filter( el => el.length > 4 )
    .map( el => {
      let kword = morphy.lemmatize(el.trim().replace(' ', '') );
      kword = kword.length > 1 ?
        kword[0].substr(0, 3) + kword[0].substr(3).toLowerCase() :
        kword.toString().substr(0, 3) + kword.toString().substr(3).toLowerCase();
      kword = kword.replace('.', '. ');
      return {
        original: el.trim(),
        keyword: kword
      }
    });

  return mainSearch.concat(searchName);
};