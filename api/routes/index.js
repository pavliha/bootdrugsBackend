const enableTokenRoutes = require('./token');
const enableUserRoutes = require('./user');

module.exports = ( app ) => {

  enableTokenRoutes(app);
  enableUserRoutes(app);

};
