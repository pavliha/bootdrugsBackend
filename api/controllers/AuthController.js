const { serverConfig, userConfig }= require('../../config/index');

const BaseController = require('./BaseController');

const TokenRepo = require('../repositories/TokenRepo');
const UserRepo = require('../repositories/UserRepo');

class AuthController extends BaseController {

  async setRequestUser ( req, res, next ) {

    let authHeader = req.get('authorization');

    if ( authHeader ) {

      try {

        let token = await TokenRepo.getFirstTokenBy({ ...serverConfig.baseAuthOptions(req), ...serverConfig.additionalAuthOptions(req) });

        if ( ! token ) {

          super.responseUnauthorized( res );

        } else {

          req.user = await UserRepo.getFirstUserBy({ _id: token.user });
          req.user.authHash = authHeader;

          next();

        }

      } catch ( error ) {

        super.responseUnauthorized( res );

      }

    } else {

      next();

    }

  }

  checkRequestUser ( req, res, next ) {

    if ( req.user ) {

      next();

    } else {

      super.responseUnauthorized( res );
    }

  }

  isMeOrAdmin ( req, res, next ) {

    if ( req.user && ( req.user.role === userConfig.roles.admin || req.user._id.toString() === req.params.id ) ) {

      next();

    } else {

      super.responseForbidden( res );

    }

  }

  isAdmin ( req, res, next ) {

    if ( req.user && req.user.role === userConfig.roles.admin ) {

      next();

    } else {

      super.responseForbidden( res );

    }
  }

}

module.exports = new AuthController();
