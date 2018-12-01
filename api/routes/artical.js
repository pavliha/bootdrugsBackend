const ArticleController = require('../controllers/ArticleController');
const validate = new require('express-joi-validation')({ passError: true });

const schemas = require('../joi/schemas');
const joiOptions = { joi: { abortEarly: false, stripUnknown: true } };


module.exports = ( app ) => {

  app.get('/api/v1/article/:id',
    validate.params( schemas.id, joiOptions ),
    ArticleController.try.getArticleById
  );

};
