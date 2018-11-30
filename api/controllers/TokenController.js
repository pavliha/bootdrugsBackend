const BaseController = require('./BaseController');

const TokenRepo = require('../repositories/TokenRepo');
const UserRepo = require('../repositories/UserRepo');

const { serverConfig } = require('../../config/index');

class TokenController extends BaseController {

  async createToken ( req, res ) {

    let { email, password } = req.body;

      let success, user = await UserRepo.getFirstUserBy({ email });

      if ( user ) {

        let userCredentials = await UserRepo.findUserCredentials({ user: user._id });

        success = userCredentials ? await userCredentials.authenticate( password ) : false;

      }

      if ( success ) {

        let token = await TokenRepo.createToken({
          user: user._id,
          userAgent: req.headers[ 'user-agent' ],
          userIp: req.connection.remoteAddress
        });

        super.responseJSON( 201, res, {
          token: { _id: token._id, hash: token.hash, expiresIn: token.createdAt + serverConfig.tokenLifeTime },
          user
        })

      } else {
        super.responseUnauthorized( res )
      }
  }

  async deleteToken ( req, res ) {

    let removeToken = await TokenRepo.delete( { hash: req.user.authHash } );

    let statusCode = removeToken.n > 0 ? 202 : 404;

    super.responseJSON( statusCode, res, {});

  }

}

module.exports = new TokenController();
