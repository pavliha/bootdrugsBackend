const enableAnalyzerRoutes = require('./analyzer');
const enableArticleRoutes = require('./artical');
const enableTrendRoutes = require('./trend');


module.exports = ( app ) => {

  enableAnalyzerRoutes(app);
  enableArticleRoutes(app);
  enableTrendRoutes(app);

};
