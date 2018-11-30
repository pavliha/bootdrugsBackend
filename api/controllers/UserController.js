const BaseController = require('./BaseController');

const UserRepo = require('../repositories/UserRepo');
const TokenRepo = require('../repositories/TokenRepo');

const sendEmail = require('../helpers/mailer');

const { serverConfig, sendGridConfig } = require('../../config/index');

class UserController extends BaseController {

  async createUser ( req, res ) {

    let data = req.body;

      let user = await UserRepo.getFirstUserBy( { email : data.email });

      if ( ! !! user ) {

          user = await UserRepo.createOne({...data}, request.passwordHash, true);

          let token = await TokenRepo.createToken({
              user: user._id,
              userAgent: req.headers['user-agent'],
              userIp: req.connection.remoteAddress
          });

          super.responseJSON(201, res, {
              user,
              token: {_id: token._id, hash: token.hash, expiresIn: token.createdAt + serverConfig.tokenLifeTime}
          });

      } else {
          super.responseJSON(401, res, {});
      }

  }

  async getUserById ( req, res ) {

    let _id = req.params.id;

    let user = await UserRepo.getFirstUserBy({ _id });

    super.responseJSON( user ? 200 : 404, res, user?  { user } : {})

  }

  async deleteUser ( req, res ) {

    let removeUser = await UserRepo.deleteUser({ _id: req.params.id });

    super.responseJSON( removeUser.n > 0 ? 202 : 404, res, { })

  }

  async sendResetPasswordRequest ( req, res ) {

    let email = req.params.email;

    let resetTokenData, user = await UserRepo.getFirstUserBy({ email });

    if ( user ) {
        // clear old tokens
        await UserRepo.deleteResetToken( filter );

        resetTokenData = await UserRepo.createResetToken( filter );

        let link = `${serverConfig.scheme}://${serverConfig.host}/${serverConfig.paths.resetPasswordRequest}/${resetTokenData.resetToken}`;

        await sendEmail(
          sendGridConfig.templates.passwordReset,
          user.email,
          { link } // generate two link for web and mobile
        );

      }

    let statusCode = user ? 201: 404;
    super.responseJSON( statusCode, res, {});

  }

  async resetUserPassword ( req, res ) {

    let passwordResetToken = req.params.passwordResetToken;
    let password = req.body.password;

    let updateResult, resetRequest = await UserRepo.getFirstResetPasswordBy({ resetToken: passwordResetToken });

    if ( resetRequest ) {

      let userCredentials = await UserRepo.findUserCredentials( { user: resetRequest.user });
      userCredentials.password = password;
      updateResult = await userCredentials.save(); // just because mongoose virtuals only works with save, not with Model.update()

      await UserRepo.deleteResetToken({ _id: resetRequest._id })

    }

    let statusCode = resetRequest && updateResult ? 202 : 404;
    super.responseJSON( statusCode, res, {});

  }

  async setUserAvatar ( req, res ) {

    let _id = req.params.id, data = req.files;

    await UserRepo.updateUser({ _id }, data );

    super.responseJSON( 202, res, {} )

  }

  async changePassword ( req, res ) {

    if( req.user && req.user.credentials ) {

      req.user.credentials.password = req.body.newPassword;
      await req.user.credentials.save();

      super.responseJSON( 204, res, {})

    } else {
      super.responseUnauthorized(res);
    }

  }

  async passwordAuth( req, res, next ) {

      let userCredentials = await UserRepo.findUserCredentials({ user: req.user._id });
      let success = userCredentials ? await userCredentials.authenticate( req.body.password ) : false;

      if( success ) {

        req.user.credentials = userCredentials;
        next()

      } else {
        super.responseUnauthorized( res );
      }
  }

  async updateUser ( req, res ) {

    if( req.user && req.user.credentials ) {

      delete req.body.password;

      let user = await UserRepo.updateUser({ _id : req.user._id}, req.body );
      super.responseJSON( 204, res, { user })

    } else {
      super.responseUnauthorized(res);
    }

  }

}

module.exports = new UserController();
