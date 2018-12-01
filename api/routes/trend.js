const TrendController = require('../controllers/TrendController');
const validate = new require('express-joi-validation')({ passError: true });

const schemas = require('../joi/schemas');
const joiOptions = { joi: { abortEarly: false, stripUnknown: true } };


module.exports = ( app ) => {

  app.get('/api/v1/trends/',
    TrendController.try.getAllTrends
  );

  app.post('/api/v1/keyword',
    validate.params( schemas.addKeyword.body, joiOptions ),
    TrendController.try.addKeyword
  );

  app.get('/api/v1/keyword/:id',
    validate.params( schemas.id, joiOptions ),
    TrendController.try.getKeywordById
  );

};
