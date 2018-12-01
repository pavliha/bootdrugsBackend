const AnalyzeController = require('../controllers/AnalyzeController');
const validate = new require('express-joi-validation')({ passError: true });

const schemas = require('../joi/schemas');
const joiOptions = { joi: { abortEarly: false, stripUnknown: true } };


module.exports = ( app ) => {

  app.post('/api/v1/analyzer',
    validate.body( schemas.analyze.body, joiOptions ),
    AnalyzeController.try.analyzer
  );

};
