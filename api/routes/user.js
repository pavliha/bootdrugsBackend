const validate = new require('express-joi-validation')({ passError: true });

const schemas = require('../joi/schemas');
const joiOptions = { joi: { abortEarly: false, stripUnknown: true } };

const AuthController = require('../controllers/AuthController');
const UserController = require('../controllers/UserController');

const uploadFile = require('../helpers/uploadFileMiddleware');

module.exports = ( app ) => {

  app.post('/api/v1/user',
    validate.body( schemas.user.create, joiOptions ),
    UserController.try.createUser
  );

  app.post('/api/v1/user/reset-password/:email',
    validate.params( schemas.email ),
    UserController.try.sendResetPasswordRequest
  );

  app.post('/api/v1/user/new-password/:passwordResetToken',
    validate.params( schemas.resetPassword.params ),
    validate.body( schemas.resetPassword.body, joiOptions ),
    UserController.try.resetUserPassword
  );

  app.get('/api/v1/user/:id',
    validate.params( schemas.id ),
    AuthController.setRequestUser,
    UserController.try.getUserById
  );

  app.post('/api/v1/user/:id/avatar',
    validate.params( schemas.id ),
    AuthController.setRequestUser,
    AuthController.isMeOrAdmin,
    uploadFile,
    UserController.try.setUserAvatar
  );

  app.delete('/api/v1/user/:id',
    validate.params( schemas.id ),
    AuthController.setRequestUser,
    AuthController.checkRequestUser,
    AuthController.isMeOrAdmin,
    UserController.try.deleteUser
  );

  app.patch('/api/v1/user/change-password',
    validate.body( schemas.user.passwordChange ),
    AuthController.setRequestUser,
    AuthController.checkRequestUser,
    UserController.try.passwordAuth,
    UserController.try.changePassword
  );

  app.patch('/api/v1/user/change-email',
    validate.body( schemas.user.emailChange ),
    AuthController.setRequestUser,
    AuthController.checkRequestUser,
    UserController.try.passwordAuth,
    UserController.try.updateUser
  );

  app.patch('/api/v1/user/:id',
    validate.params( schemas.id ),
    validate.body( schemas.user.update ),
    AuthController.setRequestUser,
    AuthController.checkRequestUser,
    AuthController.isMeOrAdmin,
    UserController.try.updateUser
  );


};
