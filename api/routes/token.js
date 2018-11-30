const validate = new require('express-joi-validation')({ passError: true });
const schemas = require('../joi/schemas');

const joiOptions = { joi: { abortEarly: false, stripUnknown: true  } };

const AuthController = require('../controllers/AuthController');
const TokenController = require('../controllers/TokenController');

module.exports = ( app ) => {

  app.post('/api/v1/token',
    validate.body( schemas.auth.body, joiOptions ),
    TokenController.try.createToken
  );

  app.delete('/api/v1/token',
    AuthController.setRequestUser,
    AuthController.checkRequestUser,
    TokenController.try.deleteToken
  );

};
